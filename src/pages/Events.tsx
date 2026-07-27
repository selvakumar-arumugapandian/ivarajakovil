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
            <div className="when">{event.dateTa}</div>
            <div>
              <h3>{event.titleTa}</h3>
              <p>{event.bodyTa}</p>
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
          <p className="lead">{eventsData.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <h2 className="group-label">வரவிருக்கும்</h2>
          <EventList items={upcoming} />

          <h2 className="group-label">முந்தைய நிகழ்வுகள்</h2>
          <EventList items={past} past />
        </div>
      </div>
    </>
  );
}
