import eventsData from "../content/events.json";
import { Reveal } from "../components/Reveal";
import "./Pages.css";

function EventList({
  items,
  past = false,
}: {
  items: typeof eventsData.events;
  past?: boolean;
}) {
  return (
    <ul className="event-board">
      {items.map((event) => (
        <Reveal as="li" key={event.id}>
          <article className={`event-card${past ? " is-past" : ""}`}>
            <div className="when">
              {event.dateTa}
              <span className="en-caption">{event.date}</span>
            </div>
            <div>
              <h3>{event.titleTa}</h3>
              <span className="en-caption">{event.titleEn}</span>
              <p>{event.bodyTa}</p>
              <span className="en-caption">{event.bodyEn}</span>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

export function Events() {
  const upcoming = eventsData.events.filter((e) => e.status === "upcoming");
  const past = eventsData.events.filter((e) => e.status === "past");

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{eventsData.titleTa}</h1>
          <span className="en-caption">{eventsData.titleEn}</span>
          <p className="lead">{eventsData.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <h2 className="group-label">வரவிருக்கும்</h2>
          <span className="en-caption">Upcoming</span>
          <EventList items={upcoming} />

          <h2 className="group-label">முந்தைய நிகழ்வுகள்</h2>
          <span className="en-caption">Past events</span>
          <EventList items={past} past />
        </div>
      </div>
    </>
  );
}
