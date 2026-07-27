import membersData from "../content/members.json";
import { Reveal } from "../components/Reveal";
import "./Pages.css";

export function Members() {
  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{membersData.titleTa}</h1>
          <span className="en-caption">{membersData.titleEn}</span>
          <p className="lead">{membersData.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <div className="note-banner">
            {membersData.noteTa}
            <span className="en-caption">{membersData.noteEn}</span>
          </div>

          <ul className="member-list">
            {membersData.members.map((member) => (
              <Reveal as="li" key={member.id} className="member-row">
                <div>
                  <h3>{member.nameTa}</h3>
                  <span className="en-caption">{member.nameEn}</span>
                </div>
                <div className="member-role">
                  {member.roleTa}
                  <span className="en-caption">{member.roleEn}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
