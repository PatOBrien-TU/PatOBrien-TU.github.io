// Enable WebMidi API and handle any errors if it fails to enable.
try {
  await WebMidi.enable();
} catch (err) {
  console.error("WebMidi could not be enabled:", err);
}

// Initialize variables to store the first MIDI input and output devices detected.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

// Get the dropdown elements from the HTML document by their IDs.
let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider = document.getElementById("slide");
let transpoAmt = document.getElementById("TranspoAmt");

// Update transposition display when slider changes
slider.addEventListener("change", function () {
  transpoAmt.innerText = `${slider.value} semitones`;
});

// Populate dropdowns with MIDI devices
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

// Add event listener for input device change
dropIns.addEventListener("change", function () {
  // Change input device
  myInput = WebMidi.inputs[dropIns.value];
});

// Add event listener for output device change
dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value];
});

// Add MIDI event listeners for noteon and noteoff
myInput.addListener("noteon", function (someMIDI) {
  let pitch = someMIDI.note.number + parseInt(slider.value);
  let velocity = someMIDI.note.rawAttack;
  let midiNoteOutput = new Note(pitch, { rawAttack: velocity });
  myOutput.sendNoteOn(midiNoteOutput);
});

myInput.addListener("noteoff", function (someMIDI) {
  let pitch = someMIDI.note.number + parseInt(slider.value);
  let velocity = someMIDI.note.rawAttack;
  let midiNoteOutput = new Note(pitch, { rawAttack: velocity });
  myOutput.sendNoteOff(midiNoteOutput);
});
