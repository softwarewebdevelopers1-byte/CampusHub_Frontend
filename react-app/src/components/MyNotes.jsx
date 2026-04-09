import { useEffect, useMemo, useState } from "react";
import styles from "../components.css.styles/notes.module.css";

const STORAGE_KEY = "studentNotes#campusHub0ZX";

const starterNotes = [
  {
    id: "note-1",
    title: "Systems Analysis Revision Map",
    unitName: "Systems Analysis",
    category: "Revision",
    pinned: true,
    updatedAt: "2026-04-08T09:30:00.000Z",
    content:
      "Focus on the system development life cycle, feasibility study, requirements gathering, and modeling tools. Review differences between structured and object-oriented analysis before the CAT.",
    tasks: [
      "Revise SDLC phases",
      "Compare DFD and use-case diagrams",
      "Practice one past paper question",
    ],
    resources: ["Lecture slides week 4", "Shared PDF: Systems Analysis notes"],
  },
  {
    id: "note-2",
    title: "Database Concepts Summary",
    unitName: "Database Systems",
    category: "Class Notes",
    pinned: false,
    updatedAt: "2026-04-07T15:10:00.000Z",
    content:
      "Normalization reduces redundancy. 1NF removes repeating groups, 2NF removes partial dependency, and 3NF removes transitive dependency. Need to revisit candidate keys and indexing.",
    tasks: ["Redraw ER diagram example", "Memorize normal forms"],
    resources: ["Database lecture recording", "ER diagram worksheet"],
  },
  {
    id: "note-3",
    title: "Questions for the Lecturer",
    unitName: "Computer Networks",
    category: "Questions",
    pinned: true,
    updatedAt: "2026-04-06T11:45:00.000Z",
    content:
      "Ask about subnetting shortcuts, packet switching examples likely to appear in exams, and whether transport layer protocols will be tested in detail.",
    tasks: ["Ask during next class", "Write down lecturer examples"],
    resources: ["Lecture timetable"],
  },
];

const blankNote = {
  id: "",
  title: "",
  unitName: "",
  category: "Class Notes",
  pinned: false,
  updatedAt: "",
  content: "",
  tasks: [],
  resources: [],
};

function MyNotes() {
  const [notes, setNotes] = useState(starterNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeNoteId, setActiveNoteId] = useState(starterNotes[0].id);
  const [draftTask, setDraftTask] = useState("");
  const [draftResource, setDraftResource] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (!savedNotes) {
      return;
    }

    try {
      const parsedNotes = JSON.parse(savedNotes);
      if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
        setNotes(parsedNotes);
        setActiveNoteId(parsedNotes[0].id);
      }
    } catch (error) {
      console.error("Unable to load saved notes", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const categories = useMemo(
    () => ["All", "Class Notes", "Revision", "Questions", "Assignments", "Ideas"],
    [],
  );

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...notes]
      .filter((note) => {
        const matchesCategory =
          categoryFilter === "All" || note.category === categoryFilter;
        const matchesSearch =
          !term ||
          note.title.toLowerCase().includes(term) ||
          note.unitName.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return Number(b.pinned) - Number(a.pinned);
        }

        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [categoryFilter, notes, searchTerm]);

  const activeNote =
    notes.find((note) => note.id === activeNoteId) || filteredNotes[0] || null;

  useEffect(() => {
    if (!activeNote && filteredNotes.length > 0) {
      setActiveNoteId(filteredNotes[0].id);
      return;
    }

    if (activeNote && activeNote.id !== activeNoteId) {
      setActiveNoteId(activeNote.id);
    }
  }, [activeNote, activeNoteId, filteredNotes]);

  const totalTasks = notes.reduce((count, note) => count + note.tasks.length, 0);
  const pinnedCount = notes.filter((note) => note.pinned).length;

  const updateNote = (field, value) => {
    if (!activeNote) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === activeNote.id
          ? {
              ...note,
              [field]: value,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
  };

  const createNewNote = () => {
    const newNote = {
      ...blankNote,
      id: `note-${Date.now()}`,
      title: "Untitled note",
      unitName: "General",
      updatedAt: new Date().toISOString(),
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setActiveNoteId(newNote.id);
    setCategoryFilter("All");
    setSearchTerm("");
  };

  const deleteActiveNote = () => {
    if (!activeNote) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${activeNote.title || "this note"}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    const remainingNotes = notes.filter((note) => note.id !== activeNote.id);
    setNotes(remainingNotes);
    setActiveNoteId(remainingNotes[0]?.id || null);
  };

  const addTask = () => {
    const task = draftTask.trim();
    if (!task || !activeNote) {
      return;
    }

    updateNote("tasks", [...activeNote.tasks, task]);
    setDraftTask("");
  };

  const removeTask = (taskIndex) => {
    if (!activeNote) {
      return;
    }

    updateNote(
      "tasks",
      activeNote.tasks.filter((_, index) => index !== taskIndex),
    );
  };

  const addResource = () => {
    const resource = draftResource.trim();
    if (!resource || !activeNote) {
      return;
    }

    updateNote("resources", [...activeNote.resources, resource]);
    setDraftResource("");
  };

  const removeResource = (resourceIndex) => {
    if (!activeNote) {
      return;
    }

    updateNote(
      "resources",
      activeNote.resources.filter((_, index) => index !== resourceIndex),
    );
  };

  return (
    <section className={styles.notesPage}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Student workspace</p>
          <h1>My Notes</h1>
          <p className={styles.subtitle}>
            Keep revision ideas, lecturer questions, and personal study points in one
            place.
          </p>
        </div>

        <div className={styles.heroActions}>
          <button className={styles.primaryAction} onClick={createNewNote}>
            <i className="fas fa-plus"></i> New Note
          </button>
          <button
            className={styles.secondaryAction}
            onClick={() => activeNote && updateNote("pinned", !activeNote.pinned)}
            disabled={!activeNote}
          >
            <i className="fas fa-thumbtack"></i>{" "}
            {activeNote?.pinned ? "Unpin Note" : "Pin Note"}
          </button>
        </div>
      </div>

      <div className={styles.metrics}>
        <article className={styles.metricCard}>
          <span>Notes</span>
          <strong>{notes.length}</strong>
          <p>Personal study entries saved</p>
        </article>
        <article className={styles.metricCard}>
          <span>Pinned</span>
          <strong>{pinnedCount}</strong>
          <p>Priority notes for quick revision</p>
        </article>
        <article className={styles.metricCard}>
          <span>Tasks</span>
          <strong>{totalTasks}</strong>
          <p>Follow-up items linked to your notes</p>
        </article>
      </div>

      <div className={styles.workspace}>
        <aside className={styles.sidebarPanel}>
          <div className={styles.panelHeader}>
            <h2>Browse Notes</h2>
            <p>Search by title, unit, or content.</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <i className="fas fa-search"></i>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search notes..."
              />
            </div>

            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.noteList}>
            {filteredNotes.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-sticky-note"></i>
                <h3>No notes found</h3>
                <p>Try a different search or create a fresh note.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  className={`${styles.noteCard} ${activeNote?.id === note.id ? styles.noteCardActive : ""}`}
                  onClick={() => setActiveNoteId(note.id)}
                >
                  <div className={styles.noteCardTop}>
                    <span className={styles.noteCategory}>{note.category}</span>
                    {note.pinned && <i className="fas fa-thumbtack"></i>}
                  </div>
                  <h3>{note.title}</h3>
                  <p>{note.unitName}</p>
                  <small>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </small>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className={styles.editorPanel}>
          {!activeNote ? (
            <div className={styles.emptyEditor}>
              <i className="fas fa-feather-alt"></i>
              <h2>Create your first note</h2>
              <p>Start a revision plan, save class highlights, or track questions.</p>
              <button className={styles.primaryAction} onClick={createNewNote}>
                Create Note
              </button>
            </div>
          ) : (
            <>
              <div className={styles.editorHeader}>
                <div className={styles.editorMeta}>
                  <input
                    className={styles.titleInput}
                    value={activeNote.title}
                    onChange={(event) => updateNote("title", event.target.value)}
                    placeholder="Note title"
                  />

                  <div className={styles.metaRow}>
                    <input
                      className={styles.unitInput}
                      value={activeNote.unitName}
                      onChange={(event) => updateNote("unitName", event.target.value)}
                      placeholder="Unit name"
                    />
                    <select
                      className={styles.categoryInput}
                      value={activeNote.category}
                      onChange={(event) => updateNote("category", event.target.value)}
                    >
                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <button className={styles.deleteAction} onClick={deleteActiveNote}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>

              <textarea
                className={styles.editorTextarea}
                value={activeNote.content}
                onChange={(event) => updateNote("content", event.target.value)}
                placeholder="Write lecture notes, revision points, or questions for your lecturer..."
              />

              <div className={styles.lowerGrid}>
                <section className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <h3>Study Tasks</h3>
                    <p>Break each note into follow-up actions.</p>
                  </div>

                  <div className={styles.inlineComposer}>
                    <input
                      value={draftTask}
                      onChange={(event) => setDraftTask(event.target.value)}
                      placeholder="Add a revision task"
                    />
                    <button onClick={addTask}>Add</button>
                  </div>

                  <div className={styles.chipList}>
                    {activeNote.tasks.length === 0 ? (
                      <p className={styles.helperText}>No study tasks yet.</p>
                    ) : (
                      activeNote.tasks.map((task, index) => (
                        <div key={`${task}-${index}`} className={styles.chipItem}>
                          <span>{task}</span>
                          <button onClick={() => removeTask(index)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <h3>Linked Resources</h3>
                    <p>Keep helpful PDFs, videos, or reminders attached.</p>
                  </div>

                  <div className={styles.inlineComposer}>
                    <input
                      value={draftResource}
                      onChange={(event) => setDraftResource(event.target.value)}
                      placeholder="Add a related resource"
                    />
                    <button onClick={addResource}>Add</button>
                  </div>

                  <div className={styles.chipList}>
                    {activeNote.resources.length === 0 ? (
                      <p className={styles.helperText}>No linked resources yet.</p>
                    ) : (
                      activeNote.resources.map((resource, index) => (
                        <div
                          key={`${resource}-${index}`}
                          className={styles.chipItem}
                        >
                          <span>{resource}</span>
                          <button onClick={() => removeResource(index)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export { MyNotes };
