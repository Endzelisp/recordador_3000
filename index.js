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