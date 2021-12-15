document.getElementById('formSendMail').addEventListener('submit', formEvt => {
    formEvt.preventDefault()
    const form = formEvt.target
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        emailFrom: form.elements.emailFrom.value,
        emailTo: form.elements.emailTo.value,
        emailSubject: form.elements.emailSubject.value,
        emailText: form.elements.emailText.value

    })
    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('containerSendMail')

    fetch('/api/sendMail', { method: 'post', body, headers }).then(resp => {
        if (resp.status < 200 || resp.status >= 300)
            throw new Error(`A requisição falhou ${resp.status}`)
        return resp.json()
    }).then(json => {
        if(json.success == true)container.innerHTML = '<b>Email Enviado com sucesso!!</b>'
        if(json.success == false)container.innerHTML = '<b>Houve um problema ao enviar o email!!</b>'
    }).catch(err => {
        container.innerHTML = `<b>Desculpe, tivemos um problema` +
            `ao enviar o email. Por favor <a href="/mail">tente novamente</a>`
    })
})