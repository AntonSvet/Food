'use strict'

window.addEventListener('DOMContentLoaded', () => {
  //tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items')

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add('hide')
      item.classList.remove('show', 'fade')
    })

    tabs.forEach((tab) => {
      tab.classList.remove('tabheader__item_active')
    })
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade')
    tabsContent[i].classList.remove('hide')
    tabs[i].classList.add('tabheader__item_active')
  }

  hideTabContent()
  showTabContent()

  tabsParent.addEventListener('click', (event) => {
    const target = event.target

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent()
          showTabContent(i)
        }
      })
    }
  })

  // timer

  const deadline = '2020-11-18'

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60)

    return {
      total: t,
      days,
      hours,
      minutes,
      seconds,
    }
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000)

    updateClock()

    function updateClock() {
      const t = getTimeRemaining(endtime)
      days.innerHTML = getZero(t.days)
      hours.innerHTML = getZero(t.hours)
      minutes.innerHTML = getZero(t.minutes)
      seconds.innerHTML = getZero(t.seconds)

      if (t.total <= 0) {
        clearInterval(timeInterval)
      }
    }
  }

  setClock('.timer', deadline)

  //  Modal window

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal')
  //modalCloseBtn = document.querySelector('[data-close]')

  function openModal() {
    modal.classList.add('show')
    modal.classList.remove('hide')
    document.body.style.overflow = 'hidden'
    clearInterval(modalTimerId)
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal)
  })

  function closeModal() {
    modal.classList.add('hide')
    modal.classList.remove('show')
    document.body.style.overflow = ''
  }

  //modalCloseBtn.addEventListener('click', closeModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal()
    }
  })
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal()
    }
  })

  const modalTimerId = setTimeout(openModal, 50000)

  function showMpdalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal()
      window.removeEventListener('scroll', showMpdalByScroll)
    }
  }

  window.addEventListener('scroll', showMpdalByScroll)

  //Forms

  const forms = document.querySelectorAll('form')

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  }

  forms.forEach((item) => postData(item))

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const statusMessage = document.createElement('img')
      statusMessage.src = message.loading
      statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `

      form.insertAdjacentElement('afterend', statusMessage)

      const formData = new FormData(form)

      const object = {}
      formData.forEach(function (value, key) {
        object[key] = value
      })

      fetch('server.php', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(object),
      })
        .then((data) => data.text())
        .then((data) => {
          console.log(data)
          showThanksModal(message.success)

          statusMessage.remove()
        })
        .catch(() => {
          showThanksModal(message.failure)
        })
        .finally(() => {
          form.reset()
        })
    })
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog')

    prevModalDialog.classList.add('hide')
    openModal()

    const thanksModal = document.createElement('div')
    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data-close> x </div>
        <div class="modal__title"> ${message} </div>
        </div>
        `

    document.querySelector('.modal').append(thanksModal)
    setTimeout(() => {
      thanksModal.remove()
      prevModalDialog.classList.add('show')
      prevModalDialog.classList.remove('hide')
      closeModal()
    }, 4000)
  }

  fetch('db.json')
    .then((data) => data.json())
    .then((res) => console.log(res))
})
