
var Grid = React.createClass({
	render: function() {

		var self = this;

		var rows = [];
		for (var i = 1; i < 12; i++){rows.push(i)};

		var createCells = function (cell) {
				return (<td key={cell} id={cell} onClick={self.props.toggle.bind(null,cell)} >{cell}</td>);
		}

		var createRows = function (row) {
			var cells = [];
			for (var j = 1; j < 9; j++){
				cells.push(row + '.' + j);
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
			console.log('toggle function: ', cell);
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



