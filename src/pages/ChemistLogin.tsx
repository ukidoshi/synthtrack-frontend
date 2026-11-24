import axios from 'axios'
import type { FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { actions, tokenKey, useAppDispatch } from '../store'

export function ChemistLogin() {
  const dispatch = useAppDispatch()
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email'))
    dispatch(actions.authPending(true))
    try {
      const response = await axios.post(
        '/api/chemists/login',
        { email, password: data.get('password') },
        { timeout: 8000 },
      )
      localStorage.setItem(tokenKey, response.data.access_token)
      dispatch(actions.session(email))
      window.location.hash = '/stages'
    } catch {
      dispatch(actions.authPending(false))
      dispatch(
        actions.showError(
          'Войти не удалось. Проверьте почту, пароль и доступность сервиса.',
        ),
      )
    }
  }
  return (
    <>
      <header className="header-section">
        <h1 className="app-title">Вход</h1>
      </header>
      <Form className="form-stack" onSubmit={login}>
        <label className="form-group form-label">
          Электронная почта
          <Form.Control
            className="form-input"
            type="email"
            name="email"
            autoComplete="username"
            required
          />
        </label>
        <label className="form-group form-label">
          Пароль
          <Form.Control
            className="form-input"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <Button variant="" className="button button-primary" type="submit">
          Войти
        </Button>
      </Form>
    </>
  )
}
