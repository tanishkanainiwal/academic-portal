// User data
let user = { name: "Taylor", role: "student", avatar: "T", theme: "light", bio: "" };
let attendance = [];
let todos = [];
let notes = [];
// let materials = [];
let courses = [];
let assignments = [];
let tests = [];
let schedule = [];
let studyLog = {};
let timer = null, timerStart = null;

// Initialize
window.onload = function() {
  loadUser();
  renderAll();
  setTab('dashboard', document.querySelector('.sidebar-nav li.active'));
};

// Load user data
function loadUser() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) user = JSON.parse(savedUser);
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.avatar;
  if (user.theme === 'dark') document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
}

// Save user data
function saveUser() {
  localStorage.setItem('user', JSON.stringify(user));
}

// Load data for each feature
function loadData() {
  attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  todos = JSON.parse(localStorage.getItem('todos') || '[]');
  notes = JSON.parse(localStorage.getItem('notes') || '[]');
//   materials = JSON.parse(localStorage.getItem('materials') || '[]');
  courses = JSON.parse(localStorage.getItem('courses') || '[]');
  assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
  tests = JSON.parse(localStorage.getItem('tests') || '[]');
  schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
  studyLog = JSON.parse(localStorage.getItem('studyLog') || '{}');
}

// Save data for each feature
function saveData() {
  localStorage.setItem('attendance', JSON.stringify(attendance));
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('notes', JSON.stringify(notes));
//   localStorage.setItem('materials', JSON.stringify(materials));
  localStorage.setItem('courses', JSON.stringify(courses));
  localStorage.setItem('assignments', JSON.stringify(assignments));
  localStorage.setItem('tests', JSON.stringify(tests));
  localStorage.setItem('schedule', JSON.stringify(schedule));
  localStorage.setItem('studyLog', JSON.stringify(studyLog));
}

// Render all features
function renderAll() {
  loadData();
  renderCourses();
  renderSchedule();
  renderAssignments();
  renderTests();
  renderTaking();
  renderCalendar();
  renderHoursChart();
  renderAttendance();
  renderTodos();
  renderNotes();
//   renderMaterials();
  renderProfile();
}

// Tab switching
function showTab(tab, el) {
  document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(tab + 'Tab').classList.remove('d-none');
}

// Courses
function renderCourses() {
  let html = courses.map((c,i) => `
    <div class="course-box">
      <i class="fas fa-book"></i>
      <b>${c.name}</b>
      <div>${c.lessons} Lessons</div>
      <div class="rate"><i class="fas fa-star"></i> ${c.rate}</div>
      <div class="type">${c.type}</div>
      <button class="delete-btn" onclick="deleteCourse(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No courses yet.</div>';
  document.getElementById('coursesList').innerHTML = html;
  document.getElementById('coursesListTab').innerHTML = html;
}
function showCourseForm() {
  document.getElementById('courseModal').classList.remove('d-none');
}
function hideCourseForm() {
  document.getElementById('courseModal').classList.add('d-none');
}
document.getElementById('courseForm').onsubmit = function(e) {
  e.preventDefault();
  courses.push({
    name: document.getElementById('courseName').value,
    lessons: document.getElementById('courseLessons').value,
    rate: document.getElementById('courseRate').value,
    type: document.getElementById('courseType').value
  });
  hideCourseForm();
  saveData();
  renderAll();
};
function deleteCourse(i) { courses.splice(i,1); saveData(); renderAll(); }

// Schedule
function renderSchedule() {
  let html = schedule.map((s,i) => `
    <div class="schedule-item">
      <i class="fas fa-calendar-alt"></i>
      <div>
        <b>${s.title}</b>
        <div style="font-size:0.9em;color:#888;">${s.type}</div>
      </div>
      <button class="delete-btn" onclick="deleteSchedule(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No schedule yet.</div>';
  document.getElementById('scheduleList').innerHTML = html;
}
function showScheduleForm() {
  document.getElementById('scheduleModal').classList.remove('d-none');
}
function hideScheduleForm() {
  document.getElementById('scheduleModal').classList.add('d-none');
}
document.getElementById('scheduleForm').onsubmit = function(e) {
  e.preventDefault();
  schedule.push({
    title: document.getElementById('scheduleTitle').value,
    type: document.getElementById('scheduleType').value
  });
  hideScheduleForm();
  saveData();
  renderAll();
};
function deleteSchedule(i) { schedule.splice(i,1); saveData(); renderAll(); }

// Assignments
function renderAssignments() {
  let html = assignments.map((a,i) => `
    <div class="assignment-item">
      <div>
        <b>${a.title}</b>
        <div style="font-size:0.9em;color:#888;">Due: ${a.due}</div>
      </div>
      <span class="status ${a.status.replace(' ','-').toLowerCase()}">${a.status}</span>
      <button class="delete-btn" onclick="deleteAssignment(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No assignments yet.</div>';
  document.getElementById('assignmentsList').innerHTML = html;
}
function showAssignmentForm() {
  document.getElementById('assignmentModal').classList.remove('d-none');
}
function hideAssignmentForm() {
  document.getElementById('assignmentModal').classList.add('d-none');
}
document.getElementById('assignmentForm').onsubmit = function(e) {
  e.preventDefault();
  assignments.push({
    title: document.getElementById('assignmentTitle').value,
    due: document.getElementById('assignmentDue').value,
    status: document.getElementById('assignmentStatus').value
  });
  hideAssignmentForm();
  saveData();
  renderAll();
};
function deleteAssignment(i) { assignments.splice(i,1); saveData(); renderAll(); }

// Tests
function renderTests() {
  let html = tests.map((t,i) => `
    <div class="test-item">
      <div>
        <b>${t.title}</b>
        <div style="font-size:0.9em;color:#888;">Date: ${t.date}</div>
      </div>
      <span class="status upcoming">Upcoming</span>
      <button class="delete-btn" onclick="deleteTest(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No tests yet.</div>';
  document.getElementById('testsList').innerHTML = html;
}
function showTestForm() {
  document.getElementById('testModal').classList.remove('d-none');
}
function hideTestForm() {
  document.getElementById('testModal').classList.add('d-none');
}
document.getElementById('testForm').onsubmit = function(e) {
  e.preventDefault();
  tests.push({
    title: document.getElementById('testTitle').value,
    date: document.getElementById('testDate').value
  });
  hideTestForm();
  saveData();
  renderAll();
};
function deleteTest(i) { tests.splice(i,1); saveData(); renderAll(); }

// Course You're Taking
function renderTaking() {
  let html = courses.map((c,i) => `
    <div class="course-item">
      <i class="fas fa-book"></i>
      <div>
        <b>${c.name}</b>
        <div style="font-size:0.9em;color:#888;">${c.type}</div>
      </div>
      <div>
        <span style="color:#888;">Lessons: ${c.lessons}</span>
        <span style="margin-left:10px;font-weight:600;">${c.rate}/5</span>
      </div>
    </div>
  `).join('') || '<div style="color:#aaa;">No active courses yet.</div>';
  document.getElementById('takingList').innerHTML = html;
}

// Calendar
function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let html = `<table class="calendar-table"><tr>
    <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
    </tr><tr>`;
  let day = 1, cell = 0;
  for (let i=0; i<firstDay; i++, cell++) html += "<td></td>";
  for (; day<=daysInMonth; day++, cell++) {
    const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    let cls = "";
    if (dateStr === today.toISOString().slice(0,10)) cls = "today";
    if (assignments.some(a=>a.due===dateStr)) cls += " has-assignment";
    if (tests.some(t=>t.date===dateStr)) cls += " has-test";
    if (attendance.some(a=>a.date===dateStr)) {
      const status = attendance.find(a=>a.date===dateStr).status;
      if (status === 'present') cls += " has-attendance";
      else if (status === 'absent') cls += " has-absent";
    }
    html += `<td class="${cls}">${day}</td>`;
    if (cell%7===6 && day!==daysInMonth) html += "</tr><tr>";
  }
  for (; cell%7!==0; cell++) html += "<td></td>";
  html += "</tr></table>";
  document.getElementById('calendar').innerHTML = html;
}

// Hours Activity (Study Timer)
function toggleTimer() {
  if (!timer) {
    timerStart = Date.now();
    timer = setInterval(updateTimerDisplay, 1000);
    document.getElementById('timerBtn').innerText = "Stop";
  } else {
    clearInterval(timer);
    timer = null;
    const elapsed = Math.floor((Date.now() - timerStart)/1000);
    const day = new Date().toISOString().slice(0,10);
    studyLog[day] = (studyLog[day]||0) + elapsed;
    saveData();
    updateTimerDisplay();
    renderHoursChart();
    document.getElementById('timerBtn').innerText = "Start";
  }
}
function updateTimerDisplay() {
  let elapsed = timer ? Math.floor((Date.now() - timerStart)/1000) : 0;
  document.getElementById('timerDisplay').innerText =
    [Math.floor(elapsed/3600), Math.floor((elapsed%3600)/60), elapsed%60].map(n=>n.toString().padStart(2,'0')).join(':');
}
function renderHoursChart() {
  const ctx = document.getElementById('hoursChart').getContext('2d');
  if (window.hoursChartInstance) window.hoursChartInstance.destroy();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date();
  let week = [];
  let total = 0;
  for(let i=0;i<7;i++) {
    let d = new Date(now);
    d.setDate(now.getDate() - ((now.getDay()+6-i)%7));
    let key = d.toISOString().slice(0,10);
    let hrs = Math.round(((studyLog[key]||0)/3600)*10)/10;
    week.push(hrs);
    total += hrs;
  }
  document.getElementById('totalHours').innerText = total;
  window.hoursChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels: days, datasets: [{ data: week, backgroundColor: '#6c47ff' }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// Attendance
function markAttendance(status) {
  let today = new Date().toISOString().slice(0,10);
  if (attendance.find(a=>a.date===today)) return alert("Already marked!");
  attendance.push({date: today, status});
  saveData();
  renderAttendance();
}
function renderAttendance() {
  let today = new Date().toISOString().slice(0,10);
  let todayStatus = attendance.find(a=>a.date===today);
  let htmlToday = todayStatus ? `Today: ${todayStatus.status}` : "Not marked today";
  let present = attendance.filter(a=>a.status==='present').length;
  let percent = attendance.length ? Math.round(present/attendance.length*100) : 0;
  let htmlStats = `Attendance: ${percent}%`;
  document.getElementById('attendanceToday').innerText = htmlToday;
  document.getElementById('attendanceStats').innerText = htmlStats;
  document.getElementById('attendanceTodayTab').innerText = htmlToday;
  document.getElementById('attendanceStatsTab').innerText = htmlStats;
  renderCalendar();
}

// To-Do
document.getElementById('todoForm').onsubmit = function(e) {
  e.preventDefault();
  todos.push({task: document.getElementById('todoInput').value, done: false});
  document.getElementById('todoInput').value = '';
  saveData();
  renderTodos();
};
document.getElementById('todoFormTab').onsubmit = function(e) {
  e.preventDefault();
  todos.push({task: document.getElementById('todoInputTab').value, done: false});
  document.getElementById('todoInputTab').value = '';
  saveData();
  renderTodos();
};
function renderTodos() {
  let html = todos.map((t,i) => `
    <div class="todo-item">
      <input type="checkbox" ${t.done?'checked':''} onchange="toggleTodo(${i})">
      <span style="${t.done?'text-decoration:line-through;':''}">${t.task}</span>
      <button class="delete-btn" onclick="deleteTodo(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No tasks yet.</div>';
  document.getElementById('todoList').innerHTML = html;
  document.getElementById('todoListTab').innerHTML = html;
}
function toggleTodo(i) { todos[i].done = !todos[i].done; saveData(); renderTodos(); }
function deleteTodo(i) { todos.splice(i,1); saveData(); renderTodos(); }

// Quick Notes
document.getElementById('noteForm').onsubmit = function(e) {
  e.preventDefault();
  notes.push({note: document.getElementById('noteInput').value, pinned: false});
  document.getElementById('noteInput').value = '';
  saveData();
  renderNotes();
};
document.getElementById('noteFormTab').onsubmit = function(e) {
  e.preventDefault();
  notes.push({note: document.getElementById('noteInputTab').value, pinned: false});
  document.getElementById('noteInputTab').value = '';
  saveData();
  renderNotes();
};
function renderNotes() {
  let html = notes.map((n,i) => `
    <div class="note-item">
      <span>${n.note}</span>
      <button class="delete-btn" onclick="deleteNote(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('') || '<div style="color:#aaa;">No notes yet.</div>';
  document.getElementById('notesList').innerHTML = html;
  document.getElementById('notesListTab').innerHTML = html;
}
function deleteNote(i) { notes.splice(i,1); saveData(); renderNotes(); }

// // Material Upload
// document.getElementById('materialFormTab').onsubmit = function(e) {
//   e.preventDefault();
//   const file = document.getElementById('materialFileTab').files[0];
//   if (!file) return alert("Please select a file.");
//   materials.push({title: document.getElementById('materialTitleTab').value, filename: file.name, date: new Date().toISOString().slice(0,10)});
//   document.getElementById('materialFormTab').reset();
//   saveData();
//   renderMaterials();
// };
// function renderMaterials() {
//   let html = materials.map((m,i) => `
//     <div class="material-item">
//       <div>
//         <b>${m.title}</b>
//         <div style="font-size:0.9em;color:#888;">${m.filename}</div>
//       </div>
//       <button class="delete-btn" onclick="deleteMaterial(${i})"><i class="fas fa-trash"></i></button>
//     </div>
//   `).join('') || '<div style="color:#aaa;">No materials yet.</div>';
//   document.getElementById('materialsListTab').innerHTML = html;
// }
// function deleteMaterial(i) { materials.splice(i,1); saveData(); renderMaterials(); }

// Profile Customization
document.getElementById('profileFormTab').onsubmit = function(e) {
  e.preventDefault();
  user.name = document.getElementById('profileNameTab').value || user.name;
  user.bio = document.getElementById('profileBioTab').value || user.bio;
  user.avatar = user.name[0].toUpperCase();
  user.theme = document.getElementById('profileThemeTab').value;
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.avatar;
  saveUser();
  renderProfile();
};
function renderProfile() {
  let html = `
    <div class="profile-info-item">
      <b>Name:</b> ${user.name}
    </div>
    <div class="profile-info-item">
      <b>Bio:</b> ${user.bio}
    </div>
    <div class="profile-info-item">
      <b>Theme:</b> ${user.theme}
    </div>
  `;
  document.getElementById('profileInfoTab').innerHTML = html;
}

// Dark/Light mode toggle
document.getElementById('themeToggle').onclick = function() {
  document.body.classList.toggle('dark-mode');
  user.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  saveUser();
};

// Set tab on load
function setTab(tab, el) {
  showTab(tab, el);
}

// Role/Name modal
document.getElementById('userForm').onsubmit = function(e) {
  e.preventDefault();
  user.name = document.getElementById('userNameInput').value.trim();
  user.role = document.getElementById('userRole').value;
  if (!user.name || !user.role) return;
  document.getElementById('roleModal').classList.add('d-none');
  document.getElementById('main-app').classList.remove('d-none');
  user.avatar = user.name[0].toUpperCase();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.avatar;
  saveUser();
  renderAll();
};
