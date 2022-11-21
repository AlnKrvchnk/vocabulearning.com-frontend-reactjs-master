import React from 'react'
import Input from '../layout/Input'
import { random, getPercentNumber, getCurrentUserToken } from '../../functions'
import Button from '../layout/Button'

export default class PaymentWidget extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            periods_value: 0
        }

        this.getPeriodsTitle = this.getPeriodsTitle.bind(this)
    }

    getPeriodsTitle () {
        switch(this.props.periods_type) {
            case 'months':
                return 'Количество месяцев'
            break;
        }
    }

    render() {
        const USER = self.userData

        // Если пользователь не авторизован
        if(!USER) return <div className="alert alert-danger" role="alert">
            <a href="/auth">Для того, чтобы провести оплату - войдите в аккаунт.</a>
        </div>

        // Функциональные данные
        let {
            price = 100,
            order_id = random(0, 9999),
            productId = 0,
            productType = 'course',
            descr = '',
            title = '',
            periods_type = false
        } = this.props

        let {
            periods_value
        } = this.state

        // Если суммы заказа нету
        if(price <= 0) return <div className="alert alert-danger" role="alert">Вы не можете оформить заказ т.к. элемент оплаты не имеет суммы.</div>

        let sale = {value: 0, percent: 0}
        let periods_title = this.getPeriodsTitle()
        
        // Периоды со скидкой
        if(periods_type && periods_value >= 3) {
            sale = getPercentNumber(15, price*periods_value)
            price = (price*periods_value) - sale.value
        }

        return (
            <div className="payment-widget container">
                <h4>{title}</h4>
                
                <form action={`https://vocabulearning.com/checkout/`} method="GET">
                    <input type="hidden" name="price" value={price} />
                    <input type="hidden" name="order_id" value={order_id} />
                    <input type="hidden" name="productName" value={title} />
                    <input type="hidden" name="productType" value={productType} />
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="descr" value={descr} />
                    <input type="hidden" name="periods_value" value={periods_value} />
                    <input type="hidden" name="periods_type" value={periods_type} />
                    <input type="hidden" name="sale" value={JSON.stringify(sale)} />
                    
                    <input type="hidden" name="user_token" value={USER.token} />
                    <input type="hidden" name="user_id" value={USER.id} />

                    <Input name={'username'} label={'Ваше ФИО'} />

                    {periods_type ? <div className="payment-widget__range">
                        <p>{periods_title}: {periods_value}</p>
                        <input value={periods_value} onChange={e => {
                            let val = e.target.value
                            this.setState(() => ({ periods_value: val }))
                        }} className="custom-range" type="range" min={0} max={12} />
                    </div> : '' }
                    
                    <p className="payment-widget__total">Сумма к оплате: {price} руб.</p>
                    <p className="payment-widget__sale">{sale.value >= 0 ? `Ваша скидка: ${sale.percent}%` : ''}</p>

                    <Button submit title={'Оплатить'} />
                </form>
            </div>
        )
    }
}