document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-button')
    const contents = document.querySelectorAll('.content')

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => {
                btn.classList.remove('button-active')
            })

            button.classList.add('button-active')

            contents.forEach((content) => {
                content.classList.remove('content-block')
            })

            const pageId = button.getAttribute('data-page')
            let content = document.getElementById(pageId)
            content.classList.add('content-block')
        })
    })

    document.getElementById('today').classList.add('content-block')
})