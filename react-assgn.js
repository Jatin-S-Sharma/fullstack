<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Student Dashboard & Todo List (React)</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }

    h2 {
      margin-top: 40px;
    }

    .student-box, .todo-box {
      background: #fff;
      border: 1px solid #ccc;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 30px;
    }

    .student-list {
      display: flex;
      flex-wrap: wrap;
    }

    .student-card {
      border: 1px solid #999;
      border-radius: 6px;
      padding: 10px;
      margin: 10px;
      width: 200px;
      background: #fff;
    }

    .highlight {
      background-color: #d9fdd3;
    }

    .todo-item {
      margin: 8px 0;
    }

    .dark-mode {
      background: #1e1e1e;
      color: #fff;
    }

    .dark-mode .student-card {
      background: #2a2a2a;
      color: #eaeaea;
    }

    .dark-mode input, .dark-mode button {
      background: #333;
      color: white;
      border: 1px solid #555;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">

    const ThemeContext = React.createContext();

    function ThemeProvider({ children }) {
      const [theme, setTheme] = React.useState("light");

      const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
      };

      return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <div className={theme === "dark" ? "dark-mode" : ""}>
            {children}
          </div>
        </ThemeContext.Provider>
      );
    }

    function StudentCard({ name, grade, attendance }) {
      const isTopper = grade.startsWith("A");
      return (
        <div className={`student-card ${isTopper ? "highlight" : ""}`}>
          <h4>{name}</h4>
          <p>Grade: {grade}</p>
          <p>Attendance: {attendance}%</p>
        </div>
      );
    }

    function StudentDashboard() {
      const students = [
        { id: 1, name: "Ankit", grade: "A", attendance: 92 },
        { id: 2, name: "Bhavna", grade: "B", attendance: 65 },
        { id: 3, name: "Chetan", grade: "A+", attendance: 88 },
        { id: 4, name: "Divya", grade: "C", attendance: 72 },
      ];

      const [showFiltered, setShowFiltered] = React.useState(false);

      const filteredList = students.filter(stu => stu.attendance > 75);
      const showList = showFiltered ? filteredList : students;

      return (
        <div className="student-box">
          <h2>Student Dashboard</h2>
          <p>Total Students: {students.length}</p>
          <button onClick={() => setShowFiltered(!showFiltered)}>
            {showFiltered ? "Show All Students" : "Show Attendance > 75%"}
          </button>
          <div className="student-list">
            {showList.map((stu) => (
              <StudentCard
                key={stu.id}
                name={stu.name}
                grade={stu.grade}
                attendance={stu.attendance}
              />
            ))}
          </div>
        </div>
      );
    }

    // Todo wala task
    function TodoList() {
      const [task, setTask] = React.useState("");
      const [todos, setTodos] = React.useState(() => {
        const saved = localStorage.getItem("todoList");
        return saved ? JSON.parse(saved) : [];
      });

      const { toggleTheme } = React.useContext(ThemeContext);

      React.useEffect(() => {
        localStorage.setItem("todoList", JSON.stringify(todos));
      }, [todos]);

      const addTodo = () => {
        if (task.trim() === "") return;
        setTodos([...todos, { id: Date.now(), text: task, done: false }]);
        setTask("");
      };

      const toggleDone = (id) => {
        setTodos(todos.map(t =>
          t.id === id ? { ...t, done: !t.done } : t
        ));
      };

      const removeTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
      };

      const allDone = todos.length > 0 && todos.every(t => t.done);

      return (
        <div className="todo-box">
          <h2>Todo List</h2>
          <button onClick={toggleTheme}>Toggle Dark Mode</button>
          <br /><br />
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
          />
          <button onClick={addTodo}>Add Task</button>

          {todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
              />
              <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                {todo.text}
              </span>
              <button onClick={() => removeTodo(todo.id)}>Delete</button>
            </div>
          ))}

          {allDone && <p> All tasks completed!</p>}
        </div>
      );
    }

    // App Component
    function App() {
      return (
        <ThemeProvider>
          <StudentDashboard />
          <TodoList />
        </ThemeProvider>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);

  </script>
</body>
</html>
