
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
			let newLiveCells = [];
			let liveNeighbors;
			let deadNeighbors = [];
			var liveCellsArr = [];
			var liveCellsArrNew = [];
			var i = 1;
			this.state.gameIsRunning = true;
			console.log('start game of life');
			console.log('start function liveCells', self.state.liveCells);

			// const neighborsFunc = (c) => {
			// 	var neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
			// 				[c[0] - 1, c[1] - 1], [c[0] - 1, c[1]],
			// 				[c[0] - 1, c[1] + 1], [c[0] + 1, c[1]],
			// 				[c[0] + 1, c[1] - 1], [c[0] + 1, c[1] + 1]];

			// 	console.log('neighbors before mapping', neighbors);
							
			// 	var effe = neighbors.map((c, index) => {
			// 		if (c[0] === 0 && c[1] === 0){c[0] = 11; c[1] = 8; neighbors[index] = c; return;}
			// 		if (c[0] === 1 && c[1] === 0) {c[0] = 1; c[1] = 8; neighbors[index] = c; return;};
			// 		if (c[0] === 0 && c[1] === 1) {c[0] = 11; c[1] = 1; neighbors[index] = c; return;};

			// 		// if (c[0] === 12 && c[1] === 0){c[0] = 1; c[1] = 8; neighbors[index] = c; return;}
			// 		// if (c[0] === 0 && c[1] === 9){c[0] = 11; c[1] = 1; neighbors[index] = c; return;}
			// 		// if (c[0] === 12 && c[1] === 9){c[0] = 1; c[1] = 1; neighbors[index] = c; return;}
			// 		if (c[0] === 0) {c[0] = 11; neighbors[index] = c; return;};
			// 		if (c[0] === 12) {c[0] = 1; neighbors[index] = c; return;};
			// 		if (c[1] === 0) {c[1] = 8; neighbors[index] = c; return;};
			// 		if (c[1] === 9) {c[1] = 1; neighbors[index] = c; return;};
			// 	});

			// 	console.log('neighbors after mapping', neighbors);
				
			// 	return neighbors;
			// }


			// const live = (c) => {
			// 	liveNeighbors = 0
			// 	var neighbors = neighborsFunc(c);
							
			// 	neighbors.map((neighbor) => {
			// 		if (_.find(liveCellsArr, neighbor) !== undefined){
			// 			liveNeighbors++
			// 		} 
			// 	});
				
			// 	if (liveNeighbors === 3){
			// 		newLiveCells.push(c);
			// 	}
			// }

			// const liveOrDie = (c) => {
			// 	console.log('live or die', c);

			// 	liveNeighbors = 0;
			// 	var neighbors = neighborsFunc(c);
			// 	console.log('neighbors', neighbors);
			// 	var effe = neighbors.map((neighbor) => {
			// 		console.log('map function');
			// 		if (_.find(liveCellsArr, neighbor) !== undefined){
			// 			liveNeighbors++
			// 			console.log(liveNeighbors);
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

			// function arrTransform (cell){
			// 	var arrEffe = [];
			// 	arrEffe.push(parseInt(cell.substr(1,1)));
			// 	arrEffe.push(parseInt(cell.substr(3,1)));
			// 	liveCellsArr.push(arrEffe);
			// }

			// function transformToRc (c){
			// 	liveCellsArrNew.push('r' + c[0] + 'c' + c[1]);
			// }


			// this.state.liveCells.map(arrTransform); TODO remove


			

			function myLoop () {
                setTimeout(function () {    //  call a 3s setTimeout when the loop is called

                	const neighborsFunc = (c) => {
                		console.log('neighborsFunc', c);
				var neighbors = [[c[0], c[1] - 1], [c[0], c[1] + 1],
							[c[0] - 1, c[1] - 1], [c[0] - 1, c[1]],
							[c[0] - 1, c[1] + 1], [c[0] + 1, c[1]],
							[c[0] + 1, c[1] - 1], [c[0] + 1, c[1] + 1]];

				console.log('neighbors before mapping', neighbors);
							
				var effe = neighbors.map((c, index) => {
					if (c[0] === 0 && c[1] === 0){c[0] = 11; c[1] = 8; neighbors[index] = c; return;}
					if (c[0] === 1 && c[1] === 0) {c[0] = 1; c[1] = 8; neighbors[index] = c; return;};
					if (c[0] === 0 && c[1] === 1) {c[0] = 11; c[1] = 1; neighbors[index] = c; return;};
					if (c[0] === 12 && c[1] === 0){c[0] = 1; c[1] = 8; neighbors[index] = c; return;}

					if (c[0] === 0 && c[1] === 9){c[0] = 11; c[1] = 1; neighbors[index] = c; return;}
					if (c[0] === 12 && c[1] === 9){c[0] = 1; c[1] = 1; neighbors[index] = c; return;}
					if (c[0] === 0) {c[0] = 11; neighbors[index] = c; return;};
					if (c[0] === 12) {c[0] = 1; neighbors[index] = c; return;};
					if (c[1] === 0) {c[1] = 8; neighbors[index] = c; return;};
					if (c[1] === 9) {c[1] = 1; neighbors[index] = c; return;};
				});

				console.log('neighbors after mapping', neighbors);
				
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
				console.log('live or die', c);

				liveNeighbors = 0;
				var neighbors = neighborsFunc(c);
				console.log('neighbors', neighbors);
				var effe = neighbors.map((neighbor) => {
					console.log('map function');
					if (_.find(liveCellsArr, neighbor) !== undefined){
						liveNeighbors++
						console.log(liveNeighbors);
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


			

			// this.state.liveCells.map(a
				    console.log('hello');          //  your code here
				    console.log('self.state.liveCells', self.state.liveCells);
					self.state.liveCells.map(arrTransform);

				    liveCellsArr.map(liveOrDie);
					deadNeighbors.map(live);
					newLiveCells.map(transformToRc);
					console.log('liveCellsArrnew[0]', liveCellsArrNew[0]);

					liveCellsArrNew.map(function(c){
						var cellClass = $('#' + c).attr('class');
						if (cellClass === '') {console.log('dead > live', c);$('#' + c).toggleClass('alive')};
					});
					console.log('self.state.liveCells', self.state.liveCells)
					self.state.liveCells.map(function(c){
						if (liveCellsArrNew.indexOf(c) === -1){
							console.log('live to dead ', c)
							$('#' + c).removeClass('alive');
						}
					});

					self.state.liveCells = liveCellsArrNew;

					console.log('self.state.liveCells end of loop', self.state.liveCells);

					deadNeighbors = [];
					newLiveCells = [];
					liveCellsArrNew = [];
					liveCellsArr = [];
			        i++;                     //  increment the counter
					// self.state.gameIsRunning = false; TODO remove

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

		render: function() {
			return (
				<div>
					 <Grid liveCells={this.state.liveCells} toggle={this.toggle}/>
					 <button type="button" className="btn" onClick={this.start}>Start</button>
	             	 <button type="button" className="btn" onClick={this.stop}>Stop</button>
				</div>
			 );
		}
	});

ReactDOM.render( <GameOfLife />, 
	document.getElementById('grid'));


