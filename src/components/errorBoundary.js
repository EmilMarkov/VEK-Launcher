import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        // Обновляет состояние, чтобы следующий рендер показал запасной UI.
        return { hasError: true, error, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        // Перехватывает ошибки в любом компоненте ниже в дереве.
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // Тут можно добавить логирование ошибки, например, отправка на сервер
        console.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // Можно рендерить запасной UI в случае ошибки
            return (_jsxs("div", { children: [_jsx("h2", { children: "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A." }), _jsxs("details", { style: { whiteSpace: 'pre-wrap' }, children: [this.state.error && this.state.error.toString(), _jsx("br", {}), this.state.errorInfo && this.state.errorInfo.componentStack] })] }));
        }
        // Если ошибок нет, рендерим детей
        return this.props.children;
    }
}
export default ErrorBoundary;
