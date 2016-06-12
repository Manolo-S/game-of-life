(function(){

let newLiveCells = [];
let liveNeighbors;
let deadNeighbors = [];
let liveCellsArr = [];
let liveCellsArrNew = [];
let rows = 20;
let columns = 20;
let cell;
let liveCellsArray = [];
for (let i = 0; i < 70; i++){
	cell = 'r' + (1 + Math.floor(rows*(Math.random()))) + 'c' + (1 + Math.floor(columns*(Math.random())));
	liveCellsArray.push(cell);
}

const neighborsFunc = (c) => {
	let neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
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
	let neighbors = neighborsFunc(c);
				
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
	let neighbors = neighborsFunc(c);
	let effe = neighbors.map((neighbor) => {
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
	let arrEffe = [];
	let indexC = cell.indexOf('c');
	let r = cell.substr(1, indexC - 1);
	let c = cell.substr(indexC + 1);
	arrEffe.push(parseInt(r));
	arrEffe.push(parseInt(c));
	liveCellsArr.push(arrEffe);
}

function transformToRc (c){
	liveCellsArrNew.push('r' + c[0] + 'c' + c[1]);
}

let Grid = React.createClass({
	render: function() {
		let self = this;
		let rowsArr = [];
		for (let i = 1; i < (rows + 1); i++){rowsArr.push('r' + i)};
		let createCells = function (cell) {
				return (<td key={cell} id={cell} className='' onClick={self.props.toggle.bind(null,cell)}></td>);
		}
		let createRows = function (row) {
			let cells = [];
			for (let j = 1; j < (columns + 1); j++){
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

let GameOfLife = React.createClass({

		getInitialState: function() {
			return {
				liveCells: liveCellsArray,
				gameIsRunning: false,
				generation: 1,
				initialGame: true
			};
		},


		componentDidMount : function () {
			this.start();
		},

		toggle: function (cell) {
			let cellClass = $('#' + cell).attr('class');
			if (cellClass === '') {
				$('#' + cell).toggleClass('alive');
				let liveCellsCopy = JSON.parse(JSON.stringify(this.state.liveCells));
				liveCellsCopy.push(cell);
				this.setState({liveCells: liveCellsCopy});
			} else {
				$('#' + cell).toggleClass('alive');
				let i = this.state.liveCells.indexOf(cell);
				let liveCellsCopy = JSON.parse(JSON.stringify(this.state.liveCells));
				liveCellsCopy.splice(i, 1);
				this.setState({liveCells: liveCellsCopy});
			}
		},			

		start: function () {
			if (this.state.liveCells.length === 0){ return;};
			if (this.state.initialGame === true){
				this.setState({liveCells: liveCellsArray});
				this.setState({initialGame: false});
			}
			let self = this;
			newLiveCells = [];
			liveNeighbors;
			deadNeighbors = [];
			liveCellsArr = [];
			liveCellsArrNew = [];
			let i = 1;
			this.setState({gameIsRunning: true});

			function myLoop () {
                setTimeout(function () {    
                	if (self.state.gameIsRunning === false){return;}
                	let nextgen = self.state.generation + 1;
                	self.setState({generation: nextgen});
					self.state.liveCells.map(arrTransform);
				    liveCellsArr.map(liveOrDie);
					deadNeighbors.map(live);
					newLiveCells.map(transformToRc);
					liveCellsArrNew.map(function(c){
						let cellClass = $('#' + c).attr('class');
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
			        i++;             
			        if (i < 1000 && self.state.gameIsRunning === true) {  
			          myLoop();            
			        }                      
		   		}, 1000);
			}
			myLoop();    
		},

		pause: function () {
			this.setState({gameIsRunning: false});
		},

		reset: function () {
			this.setState({gameIsRunning: false});
			this.setState({generation: 1});
			this.setState({liveCells: []});
			this.state.liveCells.map((c) => {
				$('#' + c).removeClass('alive');
			});
		},

		render: function() {
			return (
				<div>
					<p>Generation: {this.state.generation}</p>
					<Grid liveCells={this.state.liveCells} toggle={this.toggle}/>
					<div id='controls'>
						<button type="button" className="btn" onClick={this.start}>Start</button>
		             	<button type="button" className="btn" onClick={this.pause}>Pause</button>
		             	<button type="button" className="btn" onClick={this.reset}>Reset</button>
	             	</div>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, document.getElementById('grid'));

})();