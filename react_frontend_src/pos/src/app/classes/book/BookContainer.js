import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { injectIntl } from 'react-intl';

import Book from "./Book"
import { appOperations } from '../../duck'
import { classesBookOperations } from './duck'
import { customersListOperations } from  "../../customers/list/duck"
import { customersMembershipsTodayOperations } from "../../customers/memberships_today/duck"
import { shopSchoolMembershipsOperations } from "../../shop/school/memberships/duck"
import { shopCartOperations } from '../../shop/cart/duck'
import { classesClassesOperations } from "../classes/duck"


const mapStateToProps = state => 
    ({
        app: state.app,
        options: state.classes.book,
        customer_memberships_today: state.customers.memberships_today,
        school_memberships: state.shop.school.memberships,
        classes: state.classes.classes,
    })

const mapDispatchToProps = dispatch =>
    ({        
        checkinCustomer(cuID, clsID, data, history) {
            dispatch(classesBookOperations.checkinCustomer(cuID, clsID, data, history))
        },
        fetchBookingOptions(clsID, cuID) {
            dispatch(classesBookOperations.fetchBookingOptions(clsID, cuID))
        },
        setPageTitle(title) {
            dispatch(appOperations.setPageTitle(title))
        },
        setPageSubtitle(title) {
            dispatch(appOperations.setPageSubtitle(title))
        },
        setSelectedCustomerID(id) {
            dispatch(customersListOperations.setSelectedCustomerID(id))
        },
        setDisplayCustomerID(id) {
            dispatch(customersListOperations.setDisplayCustomerID(id))
        },
        clearShopCart() {
            dispatch(shopCartOperations.clearItems())
        },
        addShopCartItem(item) {
            dispatch(shopCartOperations.addItem(item))
        },
        clearMembershipsToday() {
            dispatch(customersMembershipsTodayOperations.clearMembershipsToday())
        },
        fetchMembershipsToday(id) {
            dispatch(customersMembershipsTodayOperations.fetchMembershipsToday(id))
        },
        fetchShopMemberships() {
            dispatch(shopSchoolMembershipsOperations.fetchShopMemberships())
        },
        fetchClasses(obj) {
            dispatch(classesClassesOperations.fetchClasses(obj))
        },
    })


const BookContainer = withRouter(injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Book)))

export default BookContainer