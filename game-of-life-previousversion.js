let newLiveCells = [];
let liveNeighbors;
let deadNeighbors = [];
let liveCellsArr = [];
let liveCellsArrNew = [];
let rows = 20;
let columns = 20;


const neighborsFunc = (c) => {
	var neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
					[c[0] - 1, c[1] - 1], [c[0] - 1, c[1]],
					[c[0] - 1, c[1] + 1], [c[0] + 1, c[1]],
					[c[0] + 1, c[1] - 1], [c[0] + 1, c[1] + 1]];

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
	liveNeighbors = 0;
	var neighbors = neighborsFunc(c);
	var effe = neighbors.map((neighbor) => {
		if (_.find(liveCellsArr, neighbor) !== undefined){
			liveNeighbors++
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
				gameIsRunning: false,
				generation: 0
			};
		},

		toggle: function (cell) {
			var cellClass = $('#' + cell).attr('class');
			if (cellClass === '') {
				$('#' + cell).toggleClass('alive');
				let liveCellsCopy = JSON.parse(JSON.stringify(this.state.liveCells));
				liveCellsCopy.push(cell);
				this.setState({liveCells: liveCellsCopy});
			} else {
				$('#' + cell).toggleClass('alive');
				var i = this.state.liveCells.indexOf(cell);
				let liveCellsCopy = JSON.parse(JSON.stringify(this.state.liveCells));
				liveCellsCopy.splice(i, 1);
				this.setState({liveCells: liveCellsCopy});
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
			this.setState({gameIsRunning: true});
			console.log('start game of life');

			function myLoop () {
                setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                	if (self.state.gameIsRunning === false){return;}
                	let nextgen = self.state.generation + 1;
                	self.setState({generation: nextgen});
                	console.log('gen: ', self.state.generation);
					self.state.liveCells.map(arrTransform);
				    liveCellsArr.map(liveOrDie);
					deadNeighbors.map(live);
					newLiveCells.map(transformToRc);
					liveCellsArrNew.map(function(c){
						var cellClass = $('#' + c).attr('class');
						if (cellClass === '') {$('#' + c).toggleClass('alive')};
					});
					self.state.liveCells.map(function(c){
						if (liveCellsArrNew.indexOf(c) === -1){
							$('#' + c).removeClass('alive');
						}
					});
					self.setState({liveCells: liveCellsArrNew});
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

		pause: function () {
			this.setState({gameIsRunning: false});
		},

		reset: function () {
			this.setState({gameIsRunning: false});
			this.setState({generation: 0});
			this.setState({liveCells: []});
			this.state.liveCells.map((c) => {
				$('#' + c).removeClass('alive');
			});
		},

		render: function() {
			return (
				<div>
					<p>{this.state.generation}</p>
					<Grid liveCells={this.state.liveCells} toggle={this.toggle}/>
					<button type="button" className="btn" onClick={this.start}>Start</button>
	             	<button type="button" className="btn" onClick={this.pause}>Pause</button>
	             	<button type="button" className="btn" onClick={this.reset}>Reset</button>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, document.getElementById('grid'));


