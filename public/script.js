var sub = document.getElementById('submitWorkout');
if(sub){  
document.getElementById('submitWorkout').addEventListener('click',function(event){
	var addWorkout = document.getElementById("addWorkout");
	var req = new XMLHttpRequest()
	
	var context = "name="+addWorkout.elements.name.value+
							"&reps="+addWorkout.elements.reps.value+
							"&weight="+addWorkout.elements.weight.value+
							"&date="+addWorkout.elements.date.value;
	if(addWorkout.elements.lbs.checked){
		context += "&lbs=1";
	}
	else{
		context += "&lbs=0";
	}
	
	req.open("GET", "/insert?" + param, true);
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400){
			
			var response = JSON.parse(req.responseText);           
			var id = response.inserted;
			
			var workoutTable = document.getElementById("workoutTable");
			
			var row = workoutTable.insertRow(-1);
			
			var name = document.createElement('td');                
			name.textContent = addWorkout.elements.name.value; 
			row.appendChild(name);
			
			var reps = document.createElement('td');
			reps.textContent = addWorkout.elements.reps.value;
			row.appendChild(reps);
			
			var weight = document.createElement('td');
			weight.textContent = addWorkout.elements.weight.value;
			row.appendChild(weight);
			
			var date = document.createElement('td');
			date.textContent = addWorkout.elements.date.value;
			row.appendChild(date);
			
			var lbs = document.createElement('td');
			if(addWorkout.elements.lbs.checked){                 
				lbs.textContent = "True";
			}
			else{
				lbs.textContent = "False";                         
			}
			row.appendChild(lbs);
			
			
			var updateData = document.createElement('td');             
			var updateDataLink = document.createElement('a');
			updateDataLink.setAttribute('href','/updateTable?id=' + id);
			var updateButton = document.createElement('input');
			updateButton.setAttribute('value','Update');
			updateButton.setAttribute('type','button');
			updateDataLink.appendChild(updateButton);
			updateData.appendChild(updateDataLink);
			row.appendChild(updateData);
			
			
			var deleteCell = document.createElement('td');
			var deleteButton = document.createElement('input');
			deleteButton.setAttribute('type','button');
			deleteButton.setAttribute('name','delete');                     
			deleteButton.setAttribute('value','Delete');
			deleteButton.setAttribute('onClick', 'deleteData("dataTable",' + id +')');
			var deleteHidden = document.createElement('input');             
			deleteHidden.setAttribute('type','hidden');
			deleteHidden.setAttribute('id', 'delete' + id);
			deleteCell.appendChild(deleteButton);                           
			deleteCell.appendChild(deleteHidden);
			row.appendChild(deleteCell);                    
			
		}
		else {
	    	console.log("error");
		}
	});
	
	req.send("/insert?" + param);
	event.preventDefault();
});
}


function deleteData(tableId, id){
	var deleteItem = "delete" + id;                             
	var table = document.getElementById("exerciseTable");       
	var numRows = table.rows.length;

	
	for(var i = 1; i < numRows; i++){                           
		var row = table.rows[i];
		var findData = row.getElementsByTagName("td");		    
		var erase = findData[findData.length -1];		        
		if(erase.children[1].id === deleteItem){                
			table.deleteRow(i);
		}

	}

	var req = new XMLHttpRequest();
	

	req.open("GET", "/delete?id=" + id, true);          

	req.addEventListener("load",function(){
		if(req.status >= 200 && req.status < 400){         
	    	console.log('success');
		} else {
		    console.log('error');
		}
	});

	req.send("/delete?id=" + id);                       
}