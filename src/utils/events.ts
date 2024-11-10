/**
 * Unmask "*" in events list to exact values
 * Remove duplicates if any
 */
export class EventWildUnmask {
  constructor(private readonly events: string[] | any) {
    // in case of enum - convert to array
    this.events = Object.values(events);
  }

  unmask(events: string[]) {
    if (events.includes('*')) {
      return this.events;
    }

    // Get only known events, log and ignore others
    const rightEvents = [];
    for (const event of events) {
      if (!this.events.includes(event)) {
        continue;
      }
      rightEvents.push(event);
    }
    return rightEvents;
  }
}
