const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

// Meses em português
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

const eventsArr = [];

// Inicializa calendário só após login e eventos carregados
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    getEvents(() => {
      initCalendar();
    });
  }
});

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  showError("Data inválida");
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>Sem eventos</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === ""){
    showError("Por favor, nomeie o evento");
    return;
  }

  // Remova a validação obrigatória das horas:
  // Se quiser, pode validar apenas se algum dos campos de hora estiver preenchido, mas não obrigar.

  // Se quiser validar formato apenas se o campo não estiver vazio:
  if (eventTimeFrom) {
    const timeFromArr = eventTimeFrom.split(":");
    if (
      timeFromArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59
    ) {
      showError("Formato de hora inicial inválido");
      return;
    }
  }
  if (eventTimeTo) {
    const timeToArr = eventTimeTo.split(":");
    if (
      timeToArr.length !== 2 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
    ) {
      showError("Formato de hora final inválido");
      return;
    }
  }

  const timeFrom = eventTimeFrom ? convertTime(eventTimeFrom) : "";
  const timeTo = eventTimeTo ? convertTime(eventTimeTo) : "";

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    showError("Evento já adicionado");
    return;
  }
  // Monta o texto do horário apenas se houver algum preenchido
  let timeText = "";
  if (timeFrom && timeTo) {
    timeText = timeFrom + " - " + timeTo;
  } else if (timeFrom) {
    timeText = timeFrom;
  } else if (timeTo) {
    timeText = timeTo;
  } // se nenhum, fica vazio

  const newEvent = {
    title: eventTitle,
    time: timeText,
  };
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  // Atualiza a UI imediatamente
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  initCalendar(); // <- Garante atualização visual do calendário (barrinha)

  // Salva no localStorage e no Firestore em background
  saveEvents(); 
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    showConfirm("Tem certeza que deseja excluir este evento?", () => {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          // Se não houver mais eventos nesse dia, remove o dia do array
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
      saveEvents();
    });
  }
});

//function to get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const dayName = dias[day.getDay()];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// Salva eventos no localStorage e sincroniza com Firestore
function saveEvents() {
  // Salva localmente
  localStorage.setItem("eventsArr", JSON.stringify(eventsArr));

  // Salva no Firestore
  const user = firebase.auth().currentUser;
  if (!user) {
    showError("Usuário não autenticado!");
    return;
  }
  firebase.firestore()
    .collection("events")
    .doc(user.uid)
    .set({ events: eventsArr })
    .then(() => {
      console.log("Eventos salvos no Firestore!");
    })
    .catch((error) => {
      showError("Erro ao salvar eventos no Firestore: " + error.message);
    });
}

// Busca eventos do localStorage ou Firestore
function getEvents(callback) {
  // Tenta carregar do localStorage primeiro
  const localData = localStorage.getItem("eventsArr");
  if (localData && localData !== "[]") {
    eventsArr.length = 0;
    try {
      eventsArr.push(...JSON.parse(localData));
    } catch (e) {
      localStorage.removeItem("eventsArr");
    }
    if (typeof callback === "function") callback();
    return;
  }

  // Se não houver local, busca do Firestore
  const user = firebase.auth().currentUser;
  if (!user) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) getEvents(callback);
    });
    return;
  }
  firebase.firestore()
    .collection("events")
    .doc(user.uid)
    .get()
    .then((doc) => {
      eventsArr.length = 0;
      if (doc.exists && doc.data().events) {
        eventsArr.push(...doc.data().events);
        // Salva no localStorage para uso futuro
        localStorage.setItem("eventsArr", JSON.stringify(eventsArr));
      }
      if (typeof callback === "function") callback();
    })
    .catch((error) => {
      showError("Erro ao carregar eventos do Firestore: " + error.message);
      if (typeof callback === "function") callback();
    });
}

// Limpa o localStorage ao deslogar
function clearEventsLocalStorage() {
  localStorage.removeItem("eventsArr");
}

// Limpa o localStorage ao sair da página
window.addEventListener("beforeunload", () => {
  // Não limpe o localStorage ao sair da página, só ao deslogar
});

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

function showError(message) {
  // Crie um elemento de mensagem de erro se ainda não existir
  let errorElement = document.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.color = "red";
    errorElement.style.fontSize = "14px";
    errorElement.style.marginTop = "10px";
    document.body.appendChild(errorElement);
  }

  // Defina a mensagem de erro e remova após 3 segundos
  errorElement.innerHTML = message;
  setTimeout(() => {
    errorElement.innerHTML = "";
  }, 3000);
}

// Supondo que seu botão tenha a classe .close-events
const closeEventsBtn = document.querySelector('.close-events');
if (closeEventsBtn) {
  closeEventsBtn.addEventListener('click', function () {
    showExit("Tem certeza que deseja sair?", () => {
        logout(event);
    });
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    getEvents(() => {
      initCalendar(); // Só inicializa o calendário após carregar os eventos do usuário
    });
  }
});
