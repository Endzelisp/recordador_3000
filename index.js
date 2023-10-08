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
    id: Number.toString(Date.now())
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

class AssignmentComponent extends HTMLElement {
  constructor(props) {
    super()
    this.id = props.id;
    this.dayOfWeek = DAYS[props.date.dayOfWeek];
    this.dayOfMonth = props.date.day;
    this.month = MONTHS[props.date.month];
    this.year = props.date.year;
    this.subject = props.subject;
    this.assignment = props.assignment;
    this.isPending = true;
  }

  connectedCallback() {
    this.classList.add('assignment');
    const subjectPara = document.createElement('p');
    subjectPara.setAttribute('id', 'subject-text');
    const assignmentPara = document.createElement('p');
    assignmentPara.setAttribute('id', 'assignment-text');
    
    subjectPara.textContent = this.subject;
    assignmentPara.textContent = this.assignment;
    
    const divDate = document.createElement('div');
    const datePara = document.createElement('p');
    const statusBtn = document.createElement('button');
    statusBtn.setAttribute('data-type', 'status-button')

    datePara.textContent = `${this.dayOfWeek} ${this.dayOfMonth} ${this.month} ${this.year}`;
    statusBtn.textContent = '📫';

    this.addEventListener('pointerdown', function(e) {
      const statusBtnGotClicked = e.target.dataset.type === 'status-button';
      if ( statusBtnGotClicked && this.isPending) {
        this.isPending = false;
        statusBtn.textContent = '✅';
        return
      }

      if (!this.isPending && statusBtnGotClicked) {
        activeAssignments = activeAssignments.filter((assignment) => this.id !== assignment.id);
        writeLocalStrg(activeAssignments);
        e.currentTarget.remove()
      }

    })
    
    divDate.append(datePara, statusBtn)
    this.append(subjectPara, assignmentPara, divDate);
  }

  disconnectedCallback() {
    
  }
}

customElements.define('assignment-component', AssignmentComponent)

addAssignmentBtn.addEventListener('pointerdown', function() {
  const date = getDate(calendarInputElem.value);
  const subject = SUBJECTS[subjectListElem.value];
  const kindOfAssignment = assignmentInputElem.value;
  const assignment = createAssignmentObject(date, subject, kindOfAssignment);
  activeAssignments.push(assignment)
  activeAssignments.sort((itemA, itemB) => itemA.date.epoch - itemB.date.epoch)
  writeLocalStrg(activeAssignments);
  assignmentContainer.innerHTML = '';
  activeAssignments.forEach(assignment => {
    const newAssignment = new AssignmentComponent(assignment)
    assignmentContainer.appendChild(newAssignment)
  })
})