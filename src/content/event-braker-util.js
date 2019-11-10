var acceptEvent = false

export function isEventAccept() {
  return acceptEvent
}

export function redispatchEvent(element, event) {
  acceptEvent = true
  //event.isDefaultPrevented = function(){ return false; }
  // event.defaultPrevented = false
  // element.dispatchEvent(event)
  $(element).trigger("click");
}