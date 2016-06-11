let newLiveCells = [];
let liveNeighbors;
let deadNeighbors = [];
let liveCellsArr = [];
let liveCellsArrNew = [];
let rows = 20;
let columns = 20;


const neighborsFunc = (c) => {
	// console.log('neighborsFunc', c);
	var neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
					[c[0] - 1, c[1] - 1], [c[0] - 1, c[1]],
					[c[0] - 1, c[1] + 1], [c[0] + 1, c[1]],
					[c[0] + 1, c[1] - 1], [c[0] + 1, c[1] + 1]];

	// console.log('neighbors before mapping', neighbors);
					
	neighbors.map((c, index) => {
		if (c[0] === 0 && c[1] === 0){c[0] = rows; c[1] = columns; neighbors[index] = c; return;}
		if (c[0] === 0 && c[1] === (columns + 1)) {c[0] = rows; c[1] = 1; neighbors[index] = c; return;};
		if (c[0] === (rows + 1) && c[1] === (columns + 1)) {c[0] = 1; c[1] = 1; neighbors[index] = c; return;};
		if (c[0] === (rows + 1) && c[1] === 0){c[0] = 1; c[1] = columns; neighbors[index] = c; return;}
		if (c[0] === 0) {c[0] = rows; neighbors[index] = c; return;};
		if (c[0] === (rows + 1)) {c[0] = 1; neighbors[index] = c; return;};
		if (c[1] === 0) {c[1] = columns; neighbors[index] = c; return;};
		if (c[1] === (columns + 1)) {c[1] = 1; neighbors[index] = c; return;};
	});

		// console.log('neighbors after mapping', neighbors);
		
		return neighbors;
}

const live = (c) => {
	liveNeighbors = 0
	var neighbors = neighborsFunc(c);
				
	neighbors.map((neighbor) => {
		if (_.find(liveCellsArr, neighbor) !== undefined){
			liveNeighbors++
		} 
	});
	
	if (liveNeighbors === 3){
		newLiveCells.push(c);
	}
}

const liveOrDie = (c) => {
	// console.log('live or die', c);

	liveNeighbors = 0;
	var neighbors = neighborsFunc(c);
	// console.log('neighbors', neighbors);
	var effe = neighbors.map((neighbor) => {
		// console.log('map function');
		if (_.find(liveCellsArr, neighbor) !== undefined){
			liveNeighbors++
			// console.log(liveNeighbors);
		} else {
			if (_.find(deadNeighbors, neighbor) === undefined){
			deadNeighbors.push(neighbor);
			}
		};
	});
	
	if (liveNeighbors === 2 || liveNeighbors === 3){
		newLiveCells.push(c);
	}
}

function arrTransform (cell){
	var arrEffe = [];
	var indexC = cell.indexOf('c');
	var r = cell.substr(1, indexC - 1);
	var c = cell.substr(indexC + 1);
	arrEffe.push(parseInt(r));
	arrEffe.push(parseInt(c));
	liveCellsArr.push(arrEffe);
}

function transformToRc (c){
	liveCellsArrNew.push('r' + c[0] + 'c' + c[1]);
}


var Grid = React.createClass({
	render: function() {

		var self = this;

		var rowsArr = [];
		for (var i = 1; i < (rows + 1); i++){rowsArr.push('r' + i)};

		var createCells = function (cell) {
				return (<td key={cell} id={cell} className='' onClick={self.props.toggle.bind(null,cell)}>{cell}</td>);
		}

		var createRows = function (row) {
			var cells = [];
			for (var j = 1; j < (columns + 1); j++){
				cells.push(row + 'c' + j);
			}			
			return (<tr key={row}>{cells.map(createCells)}</tr>);
		};
	

		return (
				<table>
					<tbody>
						{rowsArr.map(createRows)}
					</tbody>
				</table>
		);
	}
});



var GameOfLife = React.createClass({

		getInitialState: function() {
			return {
				liveCells: [],
				gameIsRunning: false
			};
		},

		toggle: function (cell) {
			console.log('toggle function: ', cell, '#' + cell);
			var cellClass = $('#' + cell).attr('class');
			if (cellClass === '') {
				$('#' + cell).toggleClass('alive');
				this.state.liveCells.push(cell);
				console.log('liveCells add', cell, '>', this.state.liveCells);				
			} else {
				$('#' + cell).toggleClass('alive');
				console.log('livecells before removing clicked cell', this.state.liveCells);
				var i = this.state.liveCells.indexOf(cell);
				this.state.liveCells.splice(i, 1);
				console.log('livecells after removing clicked cell', this.state.liveCells);
			}
			
		},			

		start: function () {
			var self = this;
			newLiveCells = [];
			liveNeighbors;
			deadNeighbors = [];
			liveCellsArr = [];
			liveCellsArrNew = [];
			var i = 1;
			this.state.gameIsRunning = true;
			console.log('start game of life');
			console.log('start function liveCells', self.state.liveCells);
			

			function myLoop () {
                setTimeout(function () {    //  call a 3s setTimeout when the loop is called

				    // console.log('hello');          //  your code here
				    // console.log('self.state.liveCells', self.state.liveCells);
					self.state.liveCells.map(arrTransform);

				    liveCellsArr.map(liveOrDie);
					deadNeighbors.map(live);
					newLiveCells.map(transformToRc);
					// console.log('liveCellsArrnew[0]', liveCellsArrNew[0]);

					liveCellsArrNew.map(function(c){
						var cellClass = $('#' + c).attr('class');
						if (cellClass === '') {$('#' + c).toggleClass('alive')};
					});
					// console.log('self.state.liveCells', self.state.liveCells)
					self.state.liveCells.map(function(c){
						if (liveCellsArrNew.indexOf(c) === -1){
							// console.log('live to dead ', c)
							$('#' + c).removeClass('alive');
						}
					});

					self.state.liveCells = liveCellsArrNew;

					// console.log('self.state.liveCells end of loop', self.state.liveCells);

					deadNeighbors = [];
					newLiveCells = [];
					liveCellsArrNew = [];
					liveCellsArr = [];
			        i++;                     //  increment the counter

			        if (i < 1000 && self.state.gameIsRunning === true) {            //  if the counter < 10, call the loop function
			          myLoop();             //  ..  again which will trigger another 
			        }                        //  ..  setTimeout()
		   		}, 1000);
			}

			myLoop();    
			
		},

		stop: function () {
			this.state.gameIsRunning = false;
		},

		reset: function () {
			this.state.gameIsRunning = false;
			this.state.liveCells.map((c) => {
				$('#' + c).removeClass('alive');
			});
			this.state.liveCells = [];
		},

		render: function() {
			return (
				<div>
					 <Grid liveCells={this.state.liveCells} toggle={this.toggle}/>
					 <button type="button" className="btn" onClick={this.start}>Start</button>
	             	 <button type="button" className="btn" onClick={this.stop}>Pause</button>
	             	 <button type="button" className="btn" onClick={this.reset}>Reset</button>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, document.getElementById('grid'));


