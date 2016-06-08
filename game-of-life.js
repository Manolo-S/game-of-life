
var Grid = React.createClass({
	render: function() {

		var rows = [];
		for (var i = 1; i < 12; i++){rows.push(i)};

		var createCells = function (cell) {
				return (<td>{cell}</td>);
		}

		var createRows = function (row) {
			var cells = [];
			for (var j = 1; j < 9; j++){
				cells.push(row + '.' + j);
			}			
			return (<tr>{cells.map(createCells)}</tr>);
		};
	

		return (
				<table>
					{rows.map(createRows)}
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

		// toggleCellStatus: function (event) {
			//
		// }

		render: function() {
			return (
				<div>
					 <Grid liveCells={this.state.liveCells}/>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, 
	document.getElementById('grid'));



