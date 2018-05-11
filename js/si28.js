var coefficientMultiplicateur = 2.5;
var chronos = [];
var chronoCurrent = 0;
var chronoGlobal = 0;
var myTimer;
var pas_timer = 200;
var myTimerGlobal;
//var timerGlobalEndDuration = 10000; // duration in ms to have the good end. It is now 10 seconds
//var timerGlobalEndDuration = 100000; // duration in ms to have the good end. It is now 100 seconds
var timerGlobalEndDuration = 30000; // duration in ms to have the good end. It is now 30 seconds

var delayForLastNote = 100; //delay in ms for the last note. We cannot have it because of the timer : if we type 10 char we will have 9 timers values. 
var firstTouch = "yes";


$(document).ready(function() {
	chronoGlobalLaunch();
	$("#notes").append("NOTES ");
	$("#time").append("TIME ");
	$('#content').keyup(function(event) {
		if (event.which == 13) 
		{
			play1note();
		}
		else
		{
			chrono();
		}	
	});
	
	
});


function replaceAll(machaine, chaineARemaplacer, chaineDeRemplacement) {
   return machaine.replace(new RegExp(chaineARemaplacer, 'g'),chaineDeRemplacement);
 }

function send() {
	
if (chronoGlobal > timerGlobalEndDuration)
{
	document.location.href = "end_win.php";
}
else {
	document.location.href = "end_lost.php";
}
}



function play1note()
{
	var content = $("#content").val();
	var noteToPlay = [];

	//on élimine les blancs et les retours charriots
	//var stringToPlay = replaceAll(content," ","");
	var stringToPlay = replaceAll(content,"\n","");
		
	//on met a jour le tableau de note à partir de la chaîne
	$("#notes").empty();
	
	for (i=0;i<stringToPlay.length;i++)
	{
		noteToPlay[i] = getNoteFromChar(stringToPlay.charCodeAt(i));
		$("#notes").append(noteToPlay[i] + "  -  ")
	}

	MIDI.loadPlugin({
			soundfontUrl: "./soundfont/",
			instruments: [ "acoustic_grand_piano"],			
			callback: function() {
				MIDI.setVolume(0,100);
				MIDI.programChange(0, 0);
				MIDI.programChange(1, 118);
				var delay = 0; 
				var velocity = 100; // how hard the note hits

				//on joue les notes
				for (i=0;i<noteToPlay.length;i++)
				{
					//MIDI.noteOn(1, 50, velocity, delay);
					MIDI.noteOn(0, noteToPlay[i], velocity, delay);
					
					if (chronos[i]==0)
					{
						chronos[i]=10;
					}
					
					if (chronos[i] > 1000)
					{
						chronos[i]=1000;
					}
					
					if(chronos[i]===undefined)
					{
						chronos[i]=delayForLastNote;
					}
					
					delay += (chronos[i]/1000) * coefficientMultiplicateur ; 
				}
				$("#time").empty();
				for (i=0;i<chronos.length;i++)
				{
					$("#time").append(chronos[i] + "  -  ");
				}
			}
		});
	
}


function incrementChrono()
{
	chronoCurrent += pas_timer;
}

function chrono()
{
	if (firstTouch=="yes")
	{
		firstTouch = "no";
	}
	else
	{
		chronos.push(chronoCurrent);
		clearInterval(myTimer);
		chronoCurrent = 0;
	}
	myTimer = setInterval(incrementChrono,pas_timer);
}

function incrementChronoGlobal()
{
	chronoGlobal += 1000;
}

function chronoGlobalLaunch()
{
	myTimerGlobal = setInterval(incrementChronoGlobal,1000);
}


function clearChronoTableDiv()
{
	$("#time").empty();
	$("#notes").empty();
	$("#content").val("");
	chronos = [];
	noteToPlay = [];
	firstTouch = "yes";
	chronoCurrent = 0;
	window.location.reload();
}

function getNoteFromChar(originalChar)
{
	//a to z
	if ( originalChar >= 97 && originalChar <= 122 )
	{
		return originalChar - 40;
	}
	//A to Z
	else if (originalChar >= 65 && originalChar <= 90 )
	{
		return originalChar - 40;
	}
	else if (originalChar == 32 )
	{
		return -1;
	}
	else 
	{
		return 50;
	}
}

