import { v4 as uuid } from "uuid"

import './styles/global.scss'
import './styles/main.scss'

const listContainer = document.querySelector<HTMLUListElement>('[data-element="list"]')
const taskForm = document.querySelector<HTMLFormElement>('[data-element="task-form"]')
const taskInput = document.querySelector<HTMLInputElement>('[data-element="task-input"]')
const themeButton = document.querySelector<HTMLButtonElement>('[data-element="theme-button"]')
const themeIcon = document.querySelector('[data-element="theme-icon"]')
const appContainer = document.querySelector('[data-element="app-container"]')
const divider = document.querySelector('[data-element="divider"]')

type Task = {
    id: string
    content: string
}

type AllTasksReturn = {
    parseTasks: Task[]
}

const tasksList: Task[] = []

function getAllTasks(): AllTasksReturn {
    const allTasks = localStorage.getItem('@tasks:list')

    if (!allTasks) {
        return;
    }

    const parseTasks: Task[] = JSON.parse(allTasks)

    return {
        parseTasks
    }
}

function insertTask({ id, content }: Task) {
    listContainer!.innerHTML += `
        <li data-element="task">
          <div>
            <input 
                data-element="task-checkbox" 
                type="checkbox" 
                id=${id}
            >

            <label 
                data-element="label" 
                for=${id} 
            >
                ${content}
            </label>
          </div>

          <button data-element="delete-button" id=${id}>
            <i class="ph-trash"></i>
          </button>
        </li>
    `
}

function saveTask({ id, content }: Task) {
    tasksList.push({
        id,
        content
    })

    localStorage.setItem('@tasks:list', JSON.stringify(tasksList))
}

function showTasksList() {
    const { parseTasks } = getAllTasks()

    parseTasks.forEach(task => insertTask(task))
}

taskForm!.addEventListener('submit', e => {
    e.preventDefault()

    if (taskInput?.value.trim() === '') {
        return;
    }

    const task: Task = {
        id: uuid(),
        content: taskInput!.value
    }

    insertTask(task)
    saveTask(task)

    taskInput!.value = ""
})

showTasksList()

function deleteTask(taskId: string) {
    const { parseTasks } = getAllTasks()

    const currentTask = parseTasks.find(task => task.id === taskId)

    if (!currentTask) {
        return;
    }

    const tasksListUpdated = parseTasks.filter(task => task.id !== currentTask.id)

    localStorage.setItem('@tasks:list', JSON.stringify(tasksListUpdated))

    window.location.reload()
}

const deleteButtons = document.querySelectorAll<HTMLButtonElement>('[data-element="delete-button"]')

deleteButtons.forEach(button => {
    button.addEventListener('click', () => deleteTask(button.id))
})

function changeTheme() {
    appContainer.classList.toggle('dark')
    divider.classList.toggle('dark')

    if (appContainer.classList.contains('dark')) {
        themeIcon.classList.remove('ph-moon-stars')
        themeIcon.classList.add('ph-sun')
    } else {
        themeIcon.classList.remove('ph-sun')
        themeIcon.classList.add('ph-moon-stars')
    }
}

themeButton.addEventListener('click', changeTheme)