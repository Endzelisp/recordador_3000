const calendarInputElem = document.querySelector('.header-form #calendar');
const subjectListElem = document.querySelector('#subject-list');
const assignmentInputElem = document.querySelector('#input-assignment');
const addAssignmentBtn = document.querySelector('.header-form #btn-add-assignment');
const assignmentContainer = document.querySelector('.assignment-container');

/**
 * get a string containing a date in the format of YYYY-MM-DD
 * and returns an object with the day, day of the week, month,
 * year and the value in milliseconds since the epoch
 * 
 * @param {String} stringDate date represented as string
 */
const getDate = function(stringDate) {
  const dateArr = stringDate
    .split('-')
    .map(item => Number.parseInt(item));
  const date = new Date(dateArr[0], --dateArr[1], dateArr[2]);
  return {
    day: date.getDate(),
    dayOfWeek: date.getDay(),
    month: date.getMonth(),
    year: date.getFullYear(),
    epoch: date.valueOf(),
  }
}

/**
 * 
 * @param {Object} date information object about the scheduled assignment 
 * @param {string} subject subject of the pending assignment
 * @param {string} assignment describing text of the pending assignment
 */
const createAssignmentObject = function(date, subject, assignment) {
  return {
    date,
    subject,
    assignment,
    id: Date.now().toString(),
    isPending: true,
  }
}

const writeLocalStrg = function (array) {
  localStorage.setItem("storage", JSON.stringify(array));
}

const readLocalStrg = function () {
  try {
    const storage = JSON.parse(localStorage?.storage);
    if (Array.isArray(storage)) return storage;
  } catch (error) {
    delete localStorage.storage;
    return [];
  }
}

let activeAssignments = [];

const SUBJECTS = {
  cas: 'Castellano',
  mat: 'Matemática',
  bio: 'Biología',
  ghc: 'Geografía e Historia',
  inf: 'Informática',
  ap: 'Arte y Patrimonio',
  ing: 'Inglés',
  ptg: 'Portugués',
  au: 'Agricultura urbana',
  ef: 'Educación física',
  to: 'Técnica de oficina',
  oc: 'Orientación y Convivencia',
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

/**
 * 
 * @param {string} typeOf type of HTML element
 * @param {object} attributes object with all the properties of the HMTL element
 * @param {string} textContent text content of the HTML element
 */
const createHTMLElement = function(typeOf = 'div', attributes = {}, textContent = '') {
  const elem = document.createElement(typeOf);
  for (const attr in attributes) {
    elem.setAttribute(attr, attributes[attr]);
  };
  elem.textContent = textContent;
  return elem
}

class AssignmentComponent extends HTMLElement {
  constructor({id, date, subject, assignment, isPending}) {
    super()
    this.id = id;
    this.dayOfWeek = DAYS[date.dayOfWeek];
    this.dayOfMonth = date.day;
    this.month = MONTHS[date.month];
    this.year = date.year;
    this.subject = subject;
    this.assignment = assignment;
    this.isPending = isPending;
  }

  connectedCallback() {
    const component = this;
    component.classList.add('assignment');
    const subjectPara = createHTMLElement('p', {id: 'subject-text'}, component.subject);
    const assignmentPara = createHTMLElement('p', {id: 'assignment-text'}, component.assignment);
    const pushpinSpan = createHTMLElement('span', {}, '📌')
    const datePara = createHTMLElement(
      'p',
      {id: 'assignment-date'},
      `${component.dayOfWeek} ${component.dayOfMonth} ${component.month} ${component.year}`
      );

    const statusBtn = createHTMLElement('button', {'data-type': 'status-button'});
    
    component.isPending ? statusBtn.textContent = '📫' : statusBtn.textContent = '✅';

    statusBtn.addEventListener('pointerdown', function(e) {
      if (component.isPending) {
        const finishedAssignment = activeAssignments.find(
          (item) => item.id === component.id
        );
        finishedAssignment.isPending = false;
        component.isPending = false;
        writeLocalStrg(activeAssignments);
        statusBtn.textContent = '✅';
        return
      }

      // component.isPending false means the assignment was completed then

      activeAssignments = activeAssignments.filter(
        (assignment) => component.id !== assignment.id
      );
      writeLocalStrg(activeAssignments);
      component.remove()
    })

    this.append(pushpinSpan, subjectPara, assignmentPara, datePara, statusBtn);
  }

  disconnectedCallback() {
    
  }
}

customElements.define('assignment-component', AssignmentComponent)

addAssignmentBtn.addEventListener('pointerdown', function() {
  const dateString = calendarInputElem.value;
  const subject = SUBJECTS[subjectListElem.value];
  const kindOfAssignment = assignmentInputElem.value.trim();
  if (dateString === '' || subject === undefined || kindOfAssignment === '') return
  const date = getDate(dateString);
  const assignment = createAssignmentObject(date, subject, kindOfAssignment);
  assignmentInputElem.value = '';
  activeAssignments.push(assignment)
  activeAssignments.sort((itemA, itemB) => itemA.date.epoch - itemB.date.epoch)
  writeLocalStrg(activeAssignments);
  assignmentContainer.innerHTML = '';
  activeAssignments.forEach(assignment => {
    const newAssignment = new AssignmentComponent(assignment)
    assignmentContainer.appendChild(newAssignment)
  })
})

window.addEventListener('load', function() {
  activeAssignments = readLocalStrg();
  activeAssignments.forEach(assignment => {
    const newAssignment = new AssignmentComponent(assignment)
    assignmentContainer.appendChild(newAssignment)
  })
})
