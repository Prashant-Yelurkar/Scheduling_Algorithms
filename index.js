var proname = "P"
var pronum = 0
var inputfieldid = "";
var quantum;
var BT =[];
var chart =[];
var Ex_queue =[];
var cpu=[];
var block =[];
var time =0;
var data=[];
var display =[];

var pause_value = false
var val;
var pr_colum = false;
var largest;
function pause(){
    pause_value = true;
    console.log(pause_value);
}
function start(){
    pause_value = false;
    console.log(pause_value);
}
function reload(){
    location.reload("index.html");
}
async function cpu_block(x,ex_time,r_time)
{
    document.getElementById("table").style.width="77%";
    var fill ='<div id="cp" class="Process '+ x +'"><p>'+ x +'</p></div>'
    document.getElementById("cpu_running").innerHTML = fill;

    if(val=="RRA")
    {
        document.getElementById("animation").style.display="block";
        if(r_time ==0)
            document.getElementById("cp").style.animationName ="example";
        else
            document.getElementById("cp").style.animationName ="example1";
        
    }
    else{
        document.getElementById("animation").style.display="block";
        document.getElementById("cpu1").style.display="none";
        document.getElementById("cp").style.animationName ="example";
        document.getElementById("animation").style.top="-100px";


    }
    
    await sleep(3000);
}   
function sleep(ms) 
{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// to add rows in table
function addrow(){

    BT =[];
    block =[];
    cpu=[];
    pronum = pronum + 1;
    inputfieldid = (proname + pronum.toString());

    var table = document.getElementById("myTable");
    var row = table.insertRow(); //insert new row
    row.id=("r"+pronum);

    var sr = row.insertCell(0);    //insert sr No cell
    sr.innerHTML = pronum;    //insert sr No data
    sr.className ="head";

    var process= row.insertCell(1);       //insert process cell
    process.innerHTML = inputfieldid;    //insert process cell

    var bt = row.insertCell(2);

    var btinpute = document.createElement("input");   // cerating inpute filed to taje Bt inputre
    btinpute.type = "number"; 
    btinpute.className = "inputfield";
    btinpute.required = true;
    btinpute.id = inputfieldid;  //setting inpute field id
    bt.appendChild(btinpute);  //adding input field

    if(val =="PRIORITY")
    {
        pr_colum =true;
        PRIORITY_table(pr_colum,pronum);

    }
}

//function to check 
async function check()
{
    
    BT=[];
    block =[];
    cpu=[];
    chart =[];
    time =0;
    var data =0;
    if(pronum==0)
    {
        alert("Add Data Then click on check!!");
        reload();
    }
    else
    {
        for (let index = 0; index < pronum; index++) {
            let id = (("P"+(index + 1)).toString());
            // console.log(id);
            data = Number(document.getElementById(id).value);
            
            if(data<0)
            {
                alert("please check burst time of " + id  );
               break;
            }
            if(data!=0){
                if(pr_colum)
                {
                    let pid = (("P"+(index + 1)+"P").toString());
                    let priority = Number(document.getElementById(pid).value);
                    BT.push([id,data,0,0,priority])
                    chart.push([id,data,0,0,priority]);
                }
                else
                {
                    BT.push([id,data])
                    chart.push([id,data]);
                }
                
            }
        }
        Ex_queue = BT;
        
        var val = document.getElementById("data1").value;
        if(data>0)
        {
            if(val.length >2)
            {
                if(val == "RRA")
                {
                    quantum = document.getElementById("quantum").value
                
                    if(quantum>0)
                    {
                        RRA_algorithm();
                    }
                    else{
                        alert("Quantum Value shpuld be Greater Than Zero");
                    }
                    document.getElementById("shuffel").innerText = "Queue.";
                }
                else if(val == "FCFS")
                {
                    document.getElementById("shuffel").innerText = "Queue.";
                    FCFS_algorithm();
                }
                else if(val =="SJF")
                {
                    document.getElementById("shuffel").innerText = "Arranging Process as per Shortes Burst TIme.";
                    SJF_algorithm();
                    
                }
                else if(val == "PRIORITY")
                {
                    document.getElementById("shuffel").innerText = "Arranging Process as per Priority.";
                    PRIORITY_algorithm();
                    
                    
                }
                
                document.getElementById("check").style.display="none"
                document.getElementById("reload").style.display="inline"
                document.getElementById("pause").style.display="inline"
                document.getElementById("start").style.display="inline"
                document.getElementById("add_row").style.display="none"
                document.getElementById("cal").style.display="inline"
            }
            else
            {
                alert("Please Select the algorithm !!!");
            }
        }
    }
    

    
}
async function FCFS_algorithm()
{
    document.getElementById("graph").style.display="flex";
    document.getElementById("shuffel").style.display="block";
    document.getElementById("Gantt_chart").style.display="block";
    document.getElementById("representation").style.display="block";
    document.getElementById("representation").style.display="flex";
    document.getElementById("cal").style.display="block";
    var run_time =0;
    for (let index = 0; index < Ex_queue.length; index++) {
        if(pause_value)
        {
            while(pause_value == true)
                await sleep(1000);
        }
        cpu_block(Ex_queue[index][0],0,0);
        if(Ex_queue[index])
        {
            var extime = Number(Ex_queue[index][1]);
            graph(index,1);
            if(extime> 0)
            {

                let balance_ex = extime - extime;
                run_time = extime;


                calculation(Ex_queue[index][0],Ex_queue[index][1],run_time);
                await sleep(1000);

                Ex_queue[index][1]=balance_ex;

                if(balance_ex ==0)
                {
                    let w_time =0;
                    for(i =0 ;i<cpu.length;i++)
                    {
                        if(Ex_queue[index][0] == (cpu[i][0]))
                        {
                            w_time = (w_time + cpu[i][1]);
                        }                                                                                              
                    }
                    for(j=0;j<chart.length;j++)
                    {
                        if(Ex_queue[index][0] == chart[j][0])
                        {
                            chart[j][2] = (time - w_time);
                            chart[j][3] = (time+ run_time);
                        }
                    }
                }

                cpu.push([Ex_queue[index][0],(extime - balance_ex)]);
                var s = '<div class="chart_block"><p class="bt">' + cpu[(cpu.length -1 )][1] + '</p><div class="block ' + cpu[(cpu.length -1 )][0] +'"><p id="'+ cpu[(cpu.length -1 )][0] +'"">' + cpu[(cpu.length -1 )][0]+'</p></div><div class="block_fotter"><div class="wt"><p>' + (time) +'</p><p id="'+ time +'" class="lt"></p></div></div></div>'
                block.push(s);
                document.getElementById("chart").innerHTML =block.join(" ");
                time = time + run_time;

                
                
            }
        }

        await sleep(2000); 
        
        for(let pr = 0; pr<Ex_queue.length; pr++)
        {
            let num  = Number(Ex_queue[pr][1]);
            if(num == 0)
            {
                Ex_queue.splice(pr,1);
                pr--;
                index--;
            }
            
        }
        if(Ex_queue.length==0)
        {
            document.getElementById(((time - run_time).toString())).innerHTML= time;
            document.getElementById("graph").style.display="none";
            document.getElementById("shuffel").style.display="none";
            document.getElementById("cp").style.display="none";
            document.getElementById("animation").style.display="none";
            document.getElementById("table").style.width="100%"
        }
    }
    table();
}

async function RRA_algorithm()
{
    document.getElementById("graph").style.display="flex";
    document.getElementById("shuffel").style.display="block";
 
    document.getElementById("cpu").style.display="inline";
    document.getElementById("Gantt_chart").style.display="block";
        document.getElementById("representation").style.display="block";
        document.getElementById("representation").style.display="flex";
        document.getElementById("cal").style.display="block";
    var run_time =0;
    for (let index = 0; index < Ex_queue.length; index++) {
        if(pause_value)
        {
            while(pause_value == true)
            await sleep(1000);
        }
        
        if(Ex_queue[index])
        {
            var extime = Number(Ex_queue[index][1]);
            graph(index,1);
            if(extime> 0)
            {

                if(Ex_queue.length == 1)
                {
                    quantum = extime;

                }
                let balance_ex = extime - quantum;
                run_time =0;
                if(balance_ex <=0)
                {

                    run_time = run_time + extime;
                    balance_ex =0;
                }
                else
                {
                    run_time = run_time +( extime - balance_ex);
                }
                cpu_block(Ex_queue[index][0],extime,balance_ex);
                calculation(Ex_queue[index][0],Ex_queue[index][1],run_time);
                await sleep(1000);


                Ex_queue[index][1]=balance_ex;

                if(balance_ex ==0)
                {
                    let w_time =0;
                    for(i =0 ;i<cpu.length;i++)
                    {
                        if(Ex_queue[index][0] == (cpu[i][0]))
                        {
                            w_time = (w_time + cpu[i][1]);
                        }                                                                                              
                    }
                    console.log(Ex_queue[index][0] + "   " + w_time);
                    for(j=0;j<chart.length;j++)
                    {
                        if(Ex_queue[index][0] == chart[j][0])
                        {
                            chart[j][2] = (time - w_time);
                            chart[j][3] = (time+ run_time);
                        }
                    }
                }

                cpu.push([Ex_queue[index][0],(extime - balance_ex)]);
                var s = '<div class="chart_block"><p class="bt">' + cpu[(cpu.length -1 )][1] + '</p><div class="block ' + cpu[(cpu.length -1 )][0] +'"><p id="'+ cpu[(cpu.length -1 )][0] +'"">' + cpu[(cpu.length -1 )][0]+'</p></div><div class="block_fotter"><div class="wt"><p>' + (time) +'</p><p id="'+ time +'" class="lt"></p></div></div></div>'
                block.push(s);
                document.getElementById("chart").innerHTML =block.join(" ");
                time = time + run_time; 
            }
        }
        await sleep(2000); 
        for(let pr = 0; pr<Ex_queue.length; pr++)
        {
            let num  = Number(Ex_queue[pr][1]);
            if(num == 0)
            {
                Ex_queue.splice(pr,1);
                pr--;
                index--;
            }
        }
    }
    if(Ex_queue.length !=0)
    {
        RRA_algorithm();
    }
    else
    {
        
        document.getElementById(((time - run_time).toString())).innerHTML= time;
        document.getElementById("graph").style.display="none";
        document.getElementById("shuffel").style.display="none";
        document.getElementById("animation").style.display="none";
        document.getElementById("table").style.width="100%"

        document.getElementById("cp").style.display="none";

        table();
    }    
}
function graph(x,y)
{
    if(pronum==5)
        document.getElementById("statistics").style.marginTop ="-16px"
    if(pronum==6)
        document.getElementById("statistics").style.marginTop ="11px"   
    if(pronum>=7)
        document.getElementById("statistics").style.marginTop ="36px"


    let graph =[];
    if(val=="RRA")
    {
        largest = Ex_queue[0][1];
        for (var i = 0; i < Ex_queue.length; i++) {
            
            if (largest < Ex_queue[i][1]) {
                largest = Ex_queue[i][1];
            }
        }
        if(largest)
        {
            let height =(160/largest);
            largest = height;
        }
        var l = Ex_queue.length;
        for(i=x;i<l;i++)
        {
    
            graph.push('<div class="main" ><div class="inner ' +   Ex_queue[i][0]+'" style="height: '+ (Ex_queue[i][1]*largest)+'px;"><p>' + Ex_queue[i][1] +'</p></div><p class="BT">' + Ex_queue[i][0] +'</p></div>')
        }
        if(x>0)
        {
        for(i=0;i<x;i++)
        {
    
            graph.push('<div class="main" ><div class="inner ' +   Ex_queue[i][0]+'" style="height: '+ (Ex_queue[i][1]*largest)+'px;"><p>' + Ex_queue[i][1] +'</p></div><p class="BT">' + Ex_queue[i][0] +'</p></div>')
        }
        }
    }
    else
    {
        let st =0;
        if(y==0)
        {
            st =0;
        }
        else
        {
            st =x
        }

        let col =0;
        if(pr_colum)
            col =4;
        else
            col =1;

        largest = Ex_queue[0][col];

        for (var i = 0; i < Ex_queue.length; i++) {
            
            if (largest < Ex_queue[i][col]) {
                largest = Ex_queue[i][col];
            }
        }
        if(largest)
        {
            let height =(160/largest);
            largest = height;
        }

        var l = Ex_queue.length;
        for(i=st;i<Ex_queue.length;i++)
        {
            if(pr_colum)
            {
                graph.push('<div class="main" ><div class="inner ' +   Ex_queue[i][0]+'" style="height: '+ (Ex_queue[i][col]*largest)+'px;"><p>' + Ex_queue[i][4] +'</p></div><p class="BT">' + Ex_queue[i][0] +'</p></div>')
            }
            else{
                graph.push('<div class="main" ><div class="inner ' +   Ex_queue[i][0]+'" style="height: '+ (Ex_queue[i][col]*largest)+'px;"><p>' + Ex_queue[i][1] +'</p></div><p class="BT">' + Ex_queue[i][0] +'</p></div>')
            }
        }
    }
    document.getElementById("graph").innerHTML = "" + graph.join(" ");

}

async function PRIORITY_table(colum,row_no)
{
    var cell;
    var row;
    var id ="P"
    pr_colum =true; 
    if(!colum)
    {
        var id = "P"
        row = document.getElementById("head");
        cell = row.insertCell(3);
        cell.innerHTML = "Priority";
    }
    
    for(i=1;i<=row_no;i++)
    {

        let j = document.getElementById((id+"_"+i))
        if(!j)
        {
            var input = document.createElement("input");
            input.className="inputfield"
            input.id = (id+i+id);
            row = document.getElementById(("r"+i));
            cell = row.insertCell(3)
            cell.appendChild(input);
        }
    }
   
}
async function PRIORITY_algorithm()
{
    document.getElementById("graph").style.display="flex";
    document.getElementById("shuffel").style.display="block";


    var run_time =0;
    for(let i =0;i<Ex_queue.length;i++)
    {
       
        for(let j = 1;j<(Ex_queue.length-i);j++)
        {
            if(pause_value)
            {
                while(pause_value == true)
                await sleep(1000);
            }
            if(Ex_queue[j-1][4]>Ex_queue[j][4])
            {
                let tem =Ex_queue[j-1];
                Ex_queue[j-1]=Ex_queue[j];
                Ex_queue[j]=tem;
                graph(0,0);
                await sleep(2000);
            }
        }
    }
    document.getElementById("cpu").style.display="inline";
    document.getElementById("Gantt_chart").style.display="block";
    document.getElementById("representation").style.display="block";
    document.getElementById("representation").style.display="flex";
    document.getElementById("cal").style.display="block";
    for (let index = 0; index < Ex_queue.length; index++) {
        if(pause_value)
        {
            while(pause_value == true)
                await sleep(1000);
        }
        cpu_block(Ex_queue[index][0],0,0);

        if(Ex_queue[index])
        {
            graph(index,1);

            var extime = Number(Ex_queue[index][1]);
            if(extime> 0)
            {

                let balance_ex = extime - extime;
                run_time = extime;

                // console.log(Ex_queue[index][0] +" , " + Ex_queue[index][1]+ " ," +run_time);
                calculation(Ex_queue[index][0],Ex_queue[index][1],run_time);
                await sleep(1000);

                Ex_queue[index][1]=balance_ex;

                if(balance_ex ==0)
                {
                    let w_time =0;
                    for(i =0 ;i<cpu.length;i++)
                    {
                        if(Ex_queue[index][0] == (cpu[i][0]))
                        {
                            w_time = (w_time + cpu[i][1]);
                        }                                                                                              
                    }
                    for(j=0;j<chart.length;j++)
                    {
                        if(Ex_queue[index][0] == chart[j][0])
                        {
                            chart[j][2] = (time - w_time);
                            chart[j][3] = (time+ run_time);
                        }
                    }
                }

                cpu.push([Ex_queue[index][0],(extime - balance_ex)]);
                var s = '<div class="chart_block"><p class="bt">' + cpu[(cpu.length -1 )][1] + '</p><div class="block ' + cpu[(cpu.length -1 )][0] +'"><p id="'+ cpu[(cpu.length -1 )][0] +'"">' + cpu[(cpu.length -1 )][0]+'</p></div><div class="block_fotter"><div class="wt"><p>' + (time) +'</p><p id="'+ time +'" class="lt"></p></div></div></div>'
                block.push(s);
                document.getElementById("chart").innerHTML =block.join(" ");
                time = time + run_time;

                
                
            }
        }

        await sleep(2000); 
        
        for(let pr = 0; pr<Ex_queue.length; pr++)
        {
            let num  = Number(Ex_queue[pr][1]);
            if(num == 0)
            {
                Ex_queue.splice(pr,1);
                pr--;
                index--;
            }
            
        }
        if(Ex_queue.length==0)
        {
            document.getElementById(((time - run_time).toString())).innerHTML= time;
            document.getElementById("cp").style.display="none";
            document.getElementById("graph").style.display="none";
            document.getElementById("shuffel").style.display="none";
            document.getElementById("animation").style.display="none";
            document.getElementById("table").style.width="100%"
        }
    }
    table();
}


async function SJF_algorithm()
{
    document.getElementById("graph").style.display="flex";
    document.getElementById("shuffel").style.display="block";


    var run_time =0;
    for(let i =0;i<Ex_queue.length;i++)
    {
 
        for(let j = 1;j<(Ex_queue.length-i);j++)
        {
            if(pause_value)
            {
                while(pause_value == true)
                await sleep(1000);
            }
            if(Ex_queue[j-1][1]>Ex_queue[j][1])
            {
                let tem = Ex_queue[j-1];
                Ex_queue[j-1]=Ex_queue[j];
                Ex_queue[j]=tem;
                graph(0,0);
                await sleep(2000);
            }
        }
    }
    document.getElementById("cpu").style.display="inline";
    document.getElementById("Gantt_chart").style.display="block";
    document.getElementById("representation").style.display="block";
    document.getElementById("representation").style.display="flex";
    document.getElementById("cal").style.display="block";
    for (let index = 0; index < Ex_queue.length; index++) {
        if(pause_value)
        {
            while(pause_value == true)
                await sleep(1000);
        }
        cpu_block(Ex_queue[index][0],0,0);

        if(Ex_queue[index])
        {
            graph(index,1);

            var extime = Number(Ex_queue[index][1]);
            if(extime> 0)
            {

                let balance_ex = extime - extime;
                run_time = extime;

                // console.log(Ex_queue[index][0] +" , " + Ex_queue[index][1]+ " ," +run_time);
                calculation(Ex_queue[index][0],Ex_queue[index][1],run_time);
                await sleep(1000);

                Ex_queue[index][1]=balance_ex;

                if(balance_ex ==0)
                {
                    let w_time =0;
                    for(i =0 ;i<cpu.length;i++)
                    {
                        if(Ex_queue[index][0] == (cpu[i][0]))
                        {
                            w_time = (w_time + cpu[i][1]);
                        }                                                                                              
                    }
                    for(j=0;j<chart.length;j++)
                    {
                        if(Ex_queue[index][0] == chart[j][0])
                        {
                            chart[j][2] = (time - w_time);
                            chart[j][3] = (time+ run_time);
                        }
                    }
                }

                cpu.push([Ex_queue[index][0],(extime - balance_ex)]);
                var s = '<div class="chart_block"><p class="bt">' + cpu[(cpu.length -1 )][1] + '</p><div class="block ' + cpu[(cpu.length -1 )][0] +'"><p id="'+ cpu[(cpu.length -1 )][0] +'"">' + cpu[(cpu.length -1 )][0]+'</p></div><div class="block_fotter"><div class="wt"><p>' + (time) +'</p><p id="'+ time +'" class="lt"></p></div></div></div>'
                block.push(s);
                document.getElementById("chart").innerHTML =block.join(" ");
                time = time + run_time;

                
                
            }
        }

        await sleep(2000); 
        
        for(let pr = 0; pr<Ex_queue.length; pr++)
        {
            let num  = Number(Ex_queue[pr][1]);
            if(num == 0)
            {
                Ex_queue.splice(pr,1);
                pr--;
                index--;
            }
            
        }
        if(Ex_queue.length==0)
        {
            document.getElementById(((time - run_time).toString())).innerHTML= time;
            document.getElementById("graph").style.display="none";
            document.getElementById("shuffel").style.display="none";
            document.getElementById("cp").style.display="none";
            document.getElementById("animation").style.display="none";
            document.getElementById("table").style.width="100%"
        }
    }
    table();
}
async function calculation(x,bt,rmt)
{
    await sleep(1000);
    var da =( x.toLowerCase());
   


    if(document.getElementById(da) ==null)
    {
        var element = document.createElement('p');
        element.id=da;
        element.className=x;
        element.style.marginTop="10px"
        element.style.fontSize="20px"
        element.innerText =  (x) + " : = "+ bt ;
        document.getElementById("calculation_area").appendChild(element);
    }
    var find = document.getElementById(da);
    if(da=="p1")
        document.getElementById(da).style.backgroundColor = "aqua";
    else if(da=="p2")
        document.getElementById(da).style.backgroundColor = "aquamarine";
    else if(da=="p3")
        document.getElementById(da).style.backgroundColor = "cadetblue";
    else if(da=="p4")
        document.getElementById(da).style.backgroundColor = "yellowgreen"; 
    else if(da=="p5")
        document.getElementById(da).style.backgroundColor = "sandybrown";
    if(find)
    {
        let bf = bt - rmt;
        let remaning_time = bf ;
        var cal = find.innerText + "  -  " + rmt + "  =  "+ remaning_time;
        console.log(cal);
        document.getElementById(da).innerText =  cal; 
        await sleep(3000);
        document.getElementById(da).style.backgroundColor="white";

    }
    await sleep(1000)
}
async function table()
{
    document.getElementById("pr_table").style.display="block";
    document.getElementById("pr_table").style.display="flex";
    var datatable = document.getElementById("table_data");
    for(i =0;i<=chart.length;i++)
    {
        var insert = datatable.insertRow(); //insert new row
        if(i==chart.length)
        {
            let sum_bt  =0;
            let sum_wt =0;
            let sum_tat =0;
            for(j=0;j<chart.length;j++)
            {
                sum_bt = sum_bt + chart[j][1];
                sum_wt = sum_wt + chart[j][2];
                sum_tat = sum_tat + chart[j][3];

            }
             
            let process= insert.insertCell(0);       //insert process cell
            process.innerHTML = "Total";    //insert process cell
            process.className ="total";

            let burst_time = insert.insertCell(1);
            burst_time.innerHTML = sum_bt;
            burst_time.className ="total";

            let Watiting_time = insert.insertCell(2);
            Watiting_time.innerHTML = sum_wt;
            Watiting_time.className ="total";

            let TAT = insert.insertCell(3);
            TAT.innerHTML = sum_tat;
            TAT.className ="total";
        }
        else{
            var process= insert.insertCell(0);       //insert process cell
            process.innerHTML = chart[i][0];    //insert process cell
            process.className ="head";

            var burst_time = insert.insertCell(1);
            burst_time.innerHTML = chart[i][1];

            var Watiting_time = insert.insertCell(2);
            Watiting_time.innerHTML = chart[i][2];

            var TAT = insert.insertCell(3);
            TAT.innerHTML = chart[i][3];
        }
        await sleep(1000);
    }
    result();
}
function result()
{
    var put = document.getElementById("result")
    let AWT =0;
    let AWT_display =" " ;
    let ATAT = 0;
    let ATAT_display =" " ;
    let symbol ="+";
    for (let index = 0; index < chart.length; index++) {
        if(index == (chart.length-1))
        {
            symbol ="";
        }
        AWT_display = (AWT_display.concat(chart[index][2])).concat(("  " +symbol+"  "));
        AWT = AWT + chart[index][2] ;
        ATAT = ATAT +  chart[index][3];
        ATAT_display = (ATAT_display.concat(chart[index][3])).concat(("  " +symbol+"  "));

    }

    let AWT_p = document.createElement('h4')
    let ATAT_p = document.createElement('h4')
    AWT_p.innerHTML = '<u>Average Waiting Time</u> : ( '+ AWT_display +' ) / ' + chart.length + ' = '+ parseFloat(AWT/chart.length).toFixed(2) + 'μs';
    ATAT_p.innerHTML = '<u>Average Turn Around Time</u> : ( '+ ATAT_display +' ) / ' + chart.length + ' = '+ parseFloat(ATAT/chart.length).toFixed(2) + 'μs';
    put.appendChild(AWT_p);
    put.appendChild(ATAT_p);

}

function get_data(){
    val = document.getElementById("data1").value;
    if(val == "RRA")
    {
        colum = true;
        document.getElementById("quantum_div").style.display="block";
        [...document.querySelectorAll('#myTable tr')].forEach((row, i) => {
            row.deleteCell(3);
        });
        pr_colum = false;
    }
    else if(val =="PRIORITY")
    {
        PRIORITY_table(pr_colum,pronum);
    }
    else if(val == "SJF" || val == "FCFS")
    {
        colum = true;
        document.getElementById("quantum_div").style.display="none";
        [...document.querySelectorAll('#myTable tr')].forEach((row, i) => {
            row.deleteCell(3);
        });
        pr_colum =false;
    }
}

