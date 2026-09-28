import express from "express"
import { createOrder, verifyBilling } from "../Controllers/billing.controller.js"
import {isAuth} from "../MiddleWare/isAuth.js"

const billingRouter = express()

billingRouter.post("/order",isAuth,createOrder)

billingRouter.post("/verify",isAuth,verifyBilling)

export default billingRouter