// Enable WebMidi API and handle any errors if it fails to enable.
await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider = document.getElementById("slide");

slider.addEventListener("input", function () {
  document.getElementById("TranspoAmt").innerText = `${slider.value} cents`;
  transposition = parseInt(slider.value);
});

WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

dropIns.addEventListener("change", function () {
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  myInput = WebMidi.inputs[dropIns.value];

  myInput.addListener("noteon", function (midiNoteInput) {
    myOutput.sendNoteOn(midiProcess(midiNoteInput).pitch, {
      rawAttack: midiNoteInput.note.rawAttack,
    });
  });

  myInput.addListener("noteoff", function (midiNoteInput) {
    myOutput.sendNoteOff(midiProcess(midiNoteInput).pitch);
  });
});

dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

let transposition = 0;

const midiProcess = function (midiNoteInput) {
  let pitch = midiNoteInput.note.number;
  let centsRatio = Math.pow(2, transposition / 1200); // Convert cents to ratio
  pitch = Math.max(0, Math.min(127, Math.round(pitch * centsRatio))); // Apply transposition
  let velocity = midiNoteInput.velocity; // Extract velocity directly from the MIDI message
  // Construct MIDI note object manually
  let midiNoteOutput = {
    pitch: pitch,
    velocity: velocity,
    channel: midiNoteInput.channel,
  };
  return midiNoteOutput;
};
