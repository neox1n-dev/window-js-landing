import checkNumInputs from "./checkNumInputs";

const forms = (state) => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input');

    checkNumInputs('input[name="user_phone"]');

    const message = {
        loading: 'Заватаження...',
        success: 'Дякуємо! Скоро ми з вами звяжемось',
        failure: 'Щось пішло не так...'
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;

        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    }

    const clearInputs = () => {
        inputs.forEach(item => {
            if(item.type === 'checkbox') {
                item.checked = false;
            }
            document.querySelectorAll('select').forEach(item => item.value = 'tree');
            item.value = '';
        })
    }

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);

            if (item.getAttribute('data-calc') === 'end' && Object.keys(state).length < 5) {
                statusMessage.textContent = 'Ви не заповнили всі дані!'
                setTimeout(() => {
                    statusMessage.remove();
                }, 5000);
            } else {
                const formData = new FormData(item);


                if (item.getAttribute('data-calc') === 'end') {
                    for (let key in state) {
                        formData.append(key, state[key])
                    }
                }

                postData('assets/server.php', formData)
                .then(res => {
                    statusMessage.textContent = message.success;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                        if(item.parentElement.parentElement.parentElement.parentElement.getAttribute('data-modal') !== null) {
                            document.querySelectorAll('[data-modal]').forEach(item => item.style.display = 'none')
                            document.body.style.overflow = '';
                        }
                    }, 5000);
                })
            }
            
        })
    })
}

export default forms;