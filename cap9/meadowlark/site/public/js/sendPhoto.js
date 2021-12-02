document.getElementById('vacationPhotoContestForm').addEventListener('submit', formEvt => {
    formEvt.preventDefault()
    const body = new FormData(formEvt.target) //objeto FormData
    const container = document.getElementById('vacationPhotoContestFormContainer')
    fetch('/api/formPhoto/{{year}}/{{month}}', { method: 'post', body }) //<-- enviando o formulário instanciado anteriormente (obj Form data)
        .then(resp => {
            if (resp.status < 200 || resp.status >= 300)
            throw new Error(`A requisição falhou ${resp.status}`)
            return resp.json()
        })
        .then(json => {
            container.innerHTML = '<b>Obrigado por enviar sua foto!</b>'
        })
        .catch(err => {
            container.innerHTML = `<b>Desculpe, tivemos um problema` +
            `inscrevendo você. Por favor <a href="/formNewsletterFetch">tente novamente</a>`
        })
})