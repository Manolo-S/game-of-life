
var Grid = React.createClass({
	render: function() {

		var self = this;

		var rows = [];
		for (var i = 1; i < 12; i++){rows.push('r' + i)};

		var createCells = function (cell) {
				return (<td key={cell} id={cell} className='' onClick={self.props.toggle.bind(null,cell)} >{cell}</td>);
		}

		var createRows = function (row) {
			var cells = [];
			for (var j = 1; j < 9; j++){
				cells.push(row + 'c' + j);
			}			
			return (<tr key={row}>{cells.map(createCells)}</tr>);
		};
	

		return (
				<table>
					<tbody>
						{rows.map(createRows)}
					</tbody>
				</table>
		);
	}
});



var GameOfLife = React.createClass({

		getInitialState: function() {
			return {
				liveCells: []
			};
		},

		toggle: function (cell) {
			console.log('toggle function: ', cell, '#' + cell);
			$('#' + cell).toggleClass('alive');
		},

		render: function() {
			return (
				<div>
					 <Grid liveCells={this.state.liveCells} toggle={this.toggle}/>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, 
	document.getElementById('grid'));



// let newLiveCells = [];
// let liveNeighbors;
// let deadNeighbors = [];

// const neighborsFunc = (c) => {
// 	let neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
// 				[c[0] - 1, c[1] - 1], [c[0] - 1, c[1]],
// 				[c[0] - 1, c[1] + 1], [c[0] + 1, c[1]],
// 				[c[0] + 1, c[1] - 1], [c[0] + 1, c[1] + 1]];
				
// 	neighbors.map((c, index) => {
// 		if (c[0] === 0) {c[0] = 11; neighbors[index] = c};
// 		if (c[0] === 12) {c[0] = 1; neighbors[index] = c};
// 		if (c[1] === 0) {c[1] = 8; neighbors[index] = c};
// 		if (c[1] === 9) {c[1] = 1; neighbors[index] = c};
// 	});
	
// 	return neighbors;
// }


// const live = (c) => {
// 	liveNeighbors = 0
// 	let neighbors = neighborsFunc(c);
				
// 	neighbors.map((neighbor) => {
// 		if (_.find(liveCells, neighbor) !== undefined){
// 			liveNeighbors++
// 		} 
// 	});
	
// 	if (liveNeighbors === 3){
// 		newLiveCells.push(c);
// 	}
// }

// const liveOrDie = (c) => {
// 	liveNeighbors = 0
// 	let neighbors = neighborsFunc(c);
	
// 	neighbors.map((neighbor) => {
// 		if (_.find(liveCells, neighbor) !== undefined){
// 			liveNeighbors++
// 		} else {
// 			if (_.find(deadNeighbors, neighbor) === undefined){
// 			deadNeighbors.push(neighbor);
// 			}
// 		};
// 	});
	
// 	if (liveNeighbors === 2 || liveNeighbors === 3){
// 		newLiveCells.push(c);
// 	}
// }


// for (let i = 0; i < 5; i++){
// 	console.log(i + ' gen liveCells',  liveCells);
// 	liveCells.map(liveOrDie);
// 	deadNeighbors.map(live);
// 	liveCells = newLiveCells;
// 	deadNeighbors = [];
// 	newLiveCells = [];
// }



