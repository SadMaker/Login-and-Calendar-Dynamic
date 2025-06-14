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

// Novos elementos para o modal do código da turma
const openClassModalBtn = document.getElementById('open-class-modal-btn');
const classCodeModal = document.getElementById('class-code-modal');
const classCodeInput = document.getElementById('class-code-input');
const confirmClassCodeBtn = document.getElementById('confirm-class-code-btn');
const cancelClassCodeBtn = document.getElementById('cancel-class-code-btn');
const leaveClassBtn = document.getElementById('leave-class-btn');
const classCodeError = document.getElementById('class-code-error');


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

// Variáveis para o sistema de turmas
let currentTurmaId = null;
let isCurrentUserAdmin = false;

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

const eventsArr = [];

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Carrega primeiro o TurmaId para depois buscar os eventos corretos
    loadTurmaId(() => {
      getEvents(() => {
        initCalendar();
        updateAdminUI(); // Atualiza a UI com base na turma e admin status
      });
    });
  }
});

let isFirstLoad = true;

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
      isFirstLoad &&
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
    } else if (!isFirstLoad && i === activeDay) {
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day active event">${i}</div>`;
      } else {
        days += `<div class="day active">${i}</div>`;
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
  updateAdminUI(); // Garante que a UI seja atualizada ao mudar mês/ano
  isFirstLoad = false;
}

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

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
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
  isFirstLoad = true; 
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

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

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

addEventSubmit.addEventListener("click", () => {
  if (currentTurmaId && !isCurrentUserAdmin) {
    showError("Você não tem permissão para adicionar eventos nesta turma.");
    return;
  }
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  if (eventTitle === ""){
    showError("Por favor, nomeie o evento");
    return;
  }
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

  let timeText = "";
  if (timeFrom && timeTo) {
    timeText = timeFrom + " - " + timeTo;
  } else if (timeFrom) {
    timeText = timeFrom;
  } else if (timeTo) {
    timeText = timeTo;
  }

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

  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  updateEvents(activeDay);

  const daysInDOM = document.querySelectorAll(".days .day");
  daysInDOM.forEach((dayElement) => {
    if (
      !dayElement.classList.contains("prev-date") &&
      !dayElement.classList.contains("next-date") &&
      Number(dayElement.textContent) === activeDay
    ) {
      if (!dayElement.classList.contains("event")) {
        dayElement.classList.add("event");
      }
    }
  });

  saveEvents();
});

eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (currentTurmaId && !isCurrentUserAdmin) {
      showError("Você não tem permissão para excluir eventos nesta turma.");
      return;
    }
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

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const dayName = dias[day.getDay()];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function saveEvents() {
  const user = firebase.auth().currentUser;
  if (!user) {
    showError("Usuário não autenticado!");
    return;
  }

  if (currentTurmaId) {
    if (!isCurrentUserAdmin) {
      showError("Você não tem permissão para salvar eventos nesta turma.");
      return;
    }
    firebase.firestore()
      .collection("turmas")
      .doc(currentTurmaId)
      .set({ events: eventsArr }, { merge: true })
      .then(() => {
        console.log(`Eventos da turma ${currentTurmaId} salvos no Firestore!`);
      })
      .catch((error) => {
        showError("Erro ao salvar eventos da turma no Firestore: " + error.message);
      });
  } else {
    // Salvar eventos pessoais
    localStorage.setItem("eventsArr", JSON.stringify(eventsArr));
    firebase.firestore()
      .collection("events")
      .doc(user.uid)
      .set({ events: eventsArr })
      .then(() => {
        console.log("Eventos pessoais salvos no Firestore!");
      })
      .catch((error) => {
        showError("Erro ao salvar eventos pessoais no Firestore: " + error.message);
      });
  }
}

function getEvents(callback) {
  const user = firebase.auth().currentUser;
  if (!user) {
    firebase.auth().onAuthStateChanged(function(userAuth) {
      if (userAuth) getEvents(callback);
      else if (typeof callback === "function") callback(); // Chama callback mesmo se não houver usuário para não bloquear initCalendar
    });
    return;
  }

  eventsArr.length = 0; // Limpa array de eventos antes de buscar novos

  if (currentTurmaId) {
    // Buscar eventos da turma
    firebase.firestore()
      .collection("turmas")
      .doc(currentTurmaId)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().events) {
          eventsArr.push(...doc.data().events);
        } else if (doc.exists && !doc.data().events) {
          console.log(`Turma ${currentTurmaId} não possui eventos.`);
        } else {
          showError(`Código da turma "${currentTurmaId}" inválido ou turma não encontrada.`);
          localStorage.removeItem('turmaId'); 
          currentTurmaId = null; 
          getPersonalEvents(user.uid, callback);
          return; 
        }
        if (typeof callback === "function") callback();
      })
      .catch((error) => {
        showError("Erro ao carregar eventos da turma do Firestore: " + error.message);
        if (typeof callback === "function") callback();
      });
  } else {
    // Buscar eventos pessoais
    getPersonalEvents(user.uid, callback);
  }
}

function getPersonalEvents(userId, callback) {
  const localData = localStorage.getItem("eventsArr");
  if (localData && localData !== "[]") {
    try {
      eventsArr.push(...JSON.parse(localData));
    } catch (e) {
      localStorage.removeItem("eventsArr"); // Limpa dados inválidos
    }
    if (typeof callback === "function") callback();
    return; // Retorna se carregou do localStorage
  }

  firebase.firestore()
    .collection("events")
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().events) {
        eventsArr.push(...doc.data().events);
        localStorage.setItem("eventsArr", JSON.stringify(eventsArr));
      }
      if (typeof callback === "function") callback();
    })
    .catch((error) => {
      showError("Erro ao carregar eventos pessoais do Firestore: " + error.message);
      if (typeof callback === "function") callback();
    });
}

// Funções para o sistema de turmas

function showError(message, isClassCodeError = false) {
  if (isClassCodeError && classCodeError) {
    classCodeError.textContent = message;
    classCodeError.style.display = 'block';
  } else {
    // Reutilizar o modal de erro existente ou criar um novo se necessário
    // Por enquanto, usando alert para simplificar, mas idealmente usar um modal
    alert(message);
  }
}

function clearClassCodeError() {
  if (classCodeError) {
    classCodeError.textContent = '';
    classCodeError.style.display = 'none';
  }
}

function loadTurmaId(callback) {
  const user = firebase.auth().currentUser;
  if (!user) {
    if (typeof callback === "function") callback();
    return;
  }

  currentTurmaId = localStorage.getItem('turmaId');
  if (currentTurmaId) {
    console.log(`Turma ID ${currentTurmaId} carregado do localStorage.`);
    checkAdminStatus(currentTurmaId, callback); 
  } else {
    firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists && doc.data().turmaId) {
        currentTurmaId = doc.data().turmaId;
        localStorage.setItem('turmaId', currentTurmaId); 
        console.log(`Turma ID ${currentTurmaId} carregado do perfil do Firebase.`);
        checkAdminStatus(currentTurmaId, callback);
      } else {
        console.log("Nenhum Turma ID no localStorage ou perfil do Firebase.");
        isCurrentUserAdmin = false; // Garante que não é admin se não há turma
        if (typeof callback === "function") callback();
      }
    }).catch(error => {
      showError("Erro ao carregar Turma ID do perfil: " + error.message);
      isCurrentUserAdmin = false;
      if (typeof callback === "function") callback();
    });
  }
}

function checkAdminStatus(turmaId, callback) {
  const user = firebase.auth().currentUser;
  if (!user || !turmaId) {
    isCurrentUserAdmin = false;
    updateAdminUI();
    if (typeof callback === "function") callback();
    return;
  }

  firebase.firestore().collection('turmas').doc(turmaId).get().then(doc => {
    if (doc.exists) {
      const turmaData = doc.data();
      if (turmaData.admins && turmaData.admins.includes(user.uid)) {
        isCurrentUserAdmin = true;
        console.log("Usuário é admin da turma.");
      } else {
        isCurrentUserAdmin = false;
        console.log("Usuário NÃO é admin da turma.");
      }
    } else {
      isCurrentUserAdmin = false;
      console.log(`Turma ${turmaId} não encontrada para verificar status de admin.`);
    }
    updateAdminUI(); 
    if (typeof callback === "function") callback();
  }).catch(error => {
    showError("Erro ao verificar status de admin: " + error.message);
    isCurrentUserAdmin = false;
    updateAdminUI();
    if (typeof callback === "function") callback();
  });
}

function joinTurma() {
  clearClassCodeError();
  const turmaIdToJoin = classCodeInput.value.trim();
  if (!turmaIdToJoin) {
    showError("Por favor, insira um código de turma.", true);
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    showError("Usuário não autenticado. Faça login para entrar em uma turma.", true);
    return;
  }

  // Verificar se a turma existe
  firebase.firestore().collection('turmas').doc(turmaIdToJoin).get().then(doc => {
    if (doc.exists) {
      currentTurmaId = turmaIdToJoin;
      localStorage.setItem('turmaId', currentTurmaId);
      // Salvar no perfil do usuário do Firebase
      firebase.firestore().collection('users').doc(user.uid).set({ turmaId: currentTurmaId }, { merge: true })
      .then(() => {
        console.log(`Turma ID ${currentTurmaId} salvo no perfil do usuário.`);
        // Após entrar na turma, verificar status de admin e recarregar eventos
        checkAdminStatus(currentTurmaId, () => {
          getEvents(() => {
            initCalendar(); // Reinicializa o calendário com os novos eventos
            updateAdminUI();
          });
        });
        classCodeModal.style.display = 'none';
        classCodeInput.value = ''; // Limpa o input
      }).catch(error => {
        showError("Erro ao salvar Turma ID no perfil: " + error.message, true);
      });
    } else {
      showError("Código da turma inválido ou turma não encontrada.", true);
      currentTurmaId = null; // Garante que não usa um ID inválido
      isCurrentUserAdmin = false;
      localStorage.removeItem('turmaId');
      // Limpar turmaId do perfil do usuário também
      firebase.firestore().collection('users').doc(user.uid).set({ turmaId: null }, { merge: true });
      updateAdminUI();
      getEvents(initCalendar); // Recarrega eventos (pessoais)
    }
  }).catch(error => {
    showError("Erro ao verificar turma: " + error.message, true);
  });
}

function leaveTurma() {
  const user = firebase.auth().currentUser;
  if (!user) {
    showError("Usuário não autenticado.");
    return;
  }

  currentTurmaId = null;
  isCurrentUserAdmin = false;
  localStorage.removeItem('turmaId');
  // Remover do perfil do usuário do Firebase
  firebase.firestore().collection('users').doc(user.uid).set({ turmaId: null }, { merge: true })
  .then(() => {
    console.log("Turma ID removido do perfil do usuário.");
    updateAdminUI();
    getEvents(() => { // Carrega eventos pessoais
      initCalendar();
    });
    classCodeModal.style.display = 'none';
  }).catch(error => {
    showError("Erro ao remover Turma ID do perfil: " + error.message);
  });
}

function updateAdminUI() {
  const user = firebase.auth().currentUser;
  if (!user) { // Se não há usuário, esconde tudo relacionado a turmas e adição de eventos
    addEventBtn.style.display = 'none';
    if(openClassModalBtn) openClassModalBtn.style.display = 'none';
    if(leaveClassBtn) leaveClassBtn.style.display = 'none';
    return;
  }

  if(openClassModalBtn) openClassModalBtn.style.display = 'inline-block'; // Sempre mostra o botão de entrar/trocar

  if (currentTurmaId) {
    if(openClassModalBtn) openClassModalBtn.textContent = 'Trocar/Ver Turma';
    if(leaveClassBtn) leaveClassBtn.style.display = 'inline-block';
    if (isCurrentUserAdmin) {
      addEventBtn.style.display = 'flex'; // Ou o display original do botão
    } else {
      addEventBtn.style.display = 'none';
    }
  } else {
    // Calendário pessoal
    addEventBtn.style.display = 'flex'; // Ou o display original
    if(openClassModalBtn) openClassModalBtn.textContent = 'Entrar na Turma';
    if(leaveClassBtn) leaveClassBtn.style.display = 'none';
  }
}


// Listeners para o modal de código da turma
if (openClassModalBtn) {
  openClassModalBtn.addEventListener('click', () => {
    clearClassCodeError();
    classCodeModal.style.display = 'block';
    // Preenche o input com o código da turma atual, se houver
    classCodeInput.value = currentTurmaId || '';
  });
}

if (cancelClassCodeBtn) {
  cancelClassCodeBtn.addEventListener('click', () => {
    classCodeModal.style.display = 'none';
    clearClassCodeError();
  });
}

if (confirmClassCodeBtn) {
  confirmClassCodeBtn.addEventListener('click', joinTurma);
}

if (leaveClassBtn) {
  leaveClassBtn.addEventListener('click', leaveTurma);
}

// Fechar modal se clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target == classCodeModal) {
    classCodeModal.style.display = 'none';
    clearClassCodeError();
  }
});

// Chamar updateAdminUI inicialmente também, caso o usuário já esteja logado e a turma carregada
// Isso é coberto pela chamada em loadTurmaId e initCalendar
// updateAdminUI();
