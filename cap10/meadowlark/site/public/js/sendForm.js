document.getElementById('newsletterSignupForm').addEventListener('submit', formEvt => {
    formEvt.preventDefault()
    const form = formEvt.target
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value,
        email: form.elements.email.value,
    })
    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('newsletterSignupFormContainer')

    fetch('/api/formNewsletter', { method: 'post', body, headers }).then(resp => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error(`A requisição falhou ${resp.status}`)
        return resp.json()
    }).then(json => {
        container.innerHTML = '<b>Obrigado por se inscrever</b>'
    }).catch(err => {
        container.innerHTML = `<b>Desculpe, tivemos um problema` +
            `inscrevendo você. Por favor <a href="/formNewsletterFetch">tente novamente</a>`
    })
})