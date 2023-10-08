const calendarInputElem = document.querySelector('.header-form #calendar');
const subjectListElem = document.querySelector('#subject-list');
const assignmentInputElem = document.querySelector('#input-assignment');
const addAssignmentBtn = document.querySelector('.header-form #btn-add-assignment');
const assignmentContainer = document.querySelector('.assignment-container');


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