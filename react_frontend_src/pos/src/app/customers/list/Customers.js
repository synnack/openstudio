import React, { Component } from "react"
import { intlShape } from "react-intl"
import PropTypes from "prop-types"
import { NavLink } from 'react-router-dom'
import validator from 'validator'
import { v4 } from 'uuid'
import { toast } from 'react-toastify'

import PageTemplate from "../../../components/PageTemplate"
import InputGroupSearch from "../../../components/ui/InputGroupSearch"
import ButtonBack from "../../../components/ui/ButtonBack"
import ButtonPrimary from "../../../components/ui/ButtonPrimary"
import ButtonCustomerAdd from "../../../components/ui/ButtonCustomerAdd"

import CustomersList from "../../../components/ui/CustomersList"
import CustomerDisplay from "./CustomerDisplay"
import CustomerFormCreate from "./CustomerFormCreate"
import CustomerFormUpdate from "./CustomerFormUpdate"

class Customers extends Component {
    constructor(props) {
        super(props)
        console.log("Customers props:")
        console.log(props)
    }

    PropTypes = {
        intl: intlShape.isRequired,
        setPageTitle: PropTypes.function,
        app: PropTypes.object,
        customers: PropTypes.object,
        customers_barcodes: PropTypes.string
    }

    componentWillMount() {
        this.props.setPageTitle(
            this.props.intl.formatMessage({ id: 'app.pos.customers.page_title' })
        )
    }

    setSearchValue(value) {
        console.log('done something :)!')
        console.log(this.props)
        this.props.clearDisplayCustomerID()
        this.props.clearSearchCustomerID()
        this.props.clearSelectedCustomerID()

        const customers = this.props.customers.data
        let cuID

        if (validator.isInt(value.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))) {
            // Find customer ID based on barcode ID
            console.log('looking for barcode_id in customers using barcode')
            for (const key of Object.keys(customers)) {
                let c = customers[key]
                // console.log(c)
                if ( c['barcode_id'] == value) {
                    cuID = c['id']
                } 
            }

            if (cuID) {
                this.props.setDisplayCustomerID(cuID)
                this.props.setSearchCustomerID(cuID)
                this.props.clearNotes()
                this.props.fetchNotes(cuID)
                this.props.clearCustomerSchoolInfo()
                this.props.fetchCustomerSchoolInfo(cuID)
            } else {
                toast.info("Unknown barcode...", {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
            }
            
            console.log('customerID')
            console.log(cuID)

        } else {
            console.log('search input is not an int value')
        }
        console.log(value)
    }

    onChange(e) {
        const value = e.target.value
        const customers = this.props.customers

        this.props.setSearchValue(value)

        console.log("timeout: " + customers.searchTimeout)
        if ( customers.searchTimeout ) {
            this.props.clearSearchTimeout()
            console.log('reset timeout')
        }

        let timeout
        this.props.setSearchTimeout(
            setTimeout(() => this.setSearchValue(value), 
                (validator.isInt(value)) ? timeout = 500 : timeout = 750)
        )
    }

    onClear(e) {
        this.props.clearSearchValue()
        this.props.clearDisplayCustomerID()
    }

    onClickAdd(e) {
        this.props.clearDisplayCustomerID()
        this.props.clearSelectedCustomerID()
        this.props.clearSearchValue()
        this.props.setUpdateCustomerStatus(false)
        this.props.clearCreateCustomerErrorData()
        this.props.setCreateCustomerStatus(!this.props.customers.create_customer)
    }

    onClickEdit(e) {
        this.props.clearUpdateCustomerErrorData()
        this.props.setUpdateCustomerStatus(!this.props.customers.update_customer)
    }

    onClickSetCustomer(e) {
        console.log('set customer clicked')
        this.props.setSelectedCustomerID(this.props.customers.displayID)
        const next_component = this.props.customers.redirect_next_component
        if (next_component) {
            this.props.history.push(next_component)
        }
    }

    onClickDeselectCustomer(e) {
        console.log('Deselect customer clicked')
        this.props.clearSelectedCustomerID()
        const next_component = this.props.customers.redirect_next_component
        if (next_component) {
            this.props.history.push(next_component)
        } else {
            this.props.history.push('/shop/products')
        }
    }

    onClickButtonBack(e) {
        console.log("clicked")
        const next_component = this.props.customers.redirect_next_component
        if (next_component) {
            this.props.history.push(next_component)
        } else {
            this.props.history.push('/shop/products')
        }
    }

    onCreateCustomer(e) {
        console.log('submit user')
        e.preventDefault()
        console.log(e.target)
        const data = new FormData(e.target)

        console.log(data.values())
        this.props.createCustomer(data)
    }

    onUpdateCustomer(e) {
        console.log('submit user')
        e.preventDefault()
        console.log(e.target)
        const data = new FormData(e.target)

        data.set('id', this.props.customers.displayID)
        console.log(data.values())
        this.props.updateCustomer(data)
    }

    onClickCustomersListItem(id) {
        console.log('clicked')
        console.log(id)
        this.props.setDisplayCustomerID(id)
        this.props.clearNotes()
        this.props.fetchNotes(id)
        this.props.clearCustomerSchoolInfo()
        this.props.fetchCustomerSchoolInfo(id)
    }

    onClickCustomerDisplayClassReconcileLater(cls) {
        console.log('clicked on:')
        console.log(cls)

        let item = {
            id: v4(),
            item_type: 'class_reconcile_later',
            quantity: 1,
            data: cls
         }
 
        console.log('item')
        console.log(item)
        
        this.props.setSelectedCustomerID(cls.auth_customer_id) 
        this.props.setDisplayCustomerID(cls.auth_customer_id) 

        this.props.clearShopCart()
        this.props.addShopCartItem(item)
        this.props.history.push('/shop/products')
    }


    render() {
        const customers = this.props.customers
        const school_info = this.props.school_info
        // const memberships = this.props.school_info.data.memberships
        // const subscriptions = this.props.school_info.data.subscriptions
        // const classcards = this.props.school_info.data.classcards
        const intl = this.props.intl
        const settings = this.props.app.settings.data
        const inputmask_date = settings.date_mask


        let customers_display = []
        if (customers.loaded) {
            if ( customers.searchID ) {
                customers_display = [
                    customers.data[customers.searchID]
                ]
            } else if (customers.search_value && customers.search_value.length > 1) {
            Object.keys(customers.data).map( (key) => {
                    // console.log('customer:')
                    // console.log(key)
                    // console.log(customers.data[key])
                    if (customers.data[key].search_name.includes(customers.search_value)) {
                        customers_display.push(customers.data[key])
                    }
                })
            }
        }

        return (
            <PageTemplate app_state={this.props.app}>
                { 
                    (!customers.loaded) ? 
                        <div>{intl.formatMessage({ id: 'app.pos.customers.loading_message' })}</div> :
                        <div>
                            <section className="customers-main-tools">
                                <div className="pull-right"> 
                                    
                                
                                    { (customers.displayID) && !(customers.selectedID) ? 
                                        <ButtonPrimary onClick={this.onClickSetCustomer.bind(this)} >
                                            Select customer
                                        </ButtonPrimary> : ''
                                    }
                                    { (customers.displayID) && (customers.selectedID) ?
                                        <ButtonPrimary onClick={this.onClickDeselectCustomer.bind(this)} >
                                            Deselect customer
                                        </ButtonPrimary> : ''   
                                    }

                                    <ButtonCustomerAdd onClick={this.onClickAdd.bind(this)} />
                                </div>
                                <ButtonBack onClick={this.onClickButtonBack.bind(this)} 
                                            classAdditional="pull-left btn-margin-right">
                                    Shop
                                </ButtonBack>

                                <InputGroupSearch placeholder={this.props.intl.formatMessage({ id: 'app.general.placeholders.search' })}
                                                onChange={this.onChange.bind(this)}
                                                onClear={this.onClear.bind(this)}
                                                value={customers.search_value} />
                            </section>
                            <section className="customers-main">
                                <CustomerDisplay customerID={customers.displayID}
                                                customers={customers} 
                                                school_info={school_info}
                                                edit_in_progress={customers.update_customer}
                                                onClickEdit={this.onClickEdit.bind(this)}
                                                onClickCreateNote={this.props.setCreateNote}
                                                onClickCancelCreateNote={this.props.clearCreateNote}
                                                OnClickUpdateNote={this.props.setUpdateNote}
                                                OnClickCancelUpdateNote={this.props.clearUpdateNote}
                                                onClickDeleteNote={this.props.deleteNote}
                                                onClickCustomerDisplayClassReconcileLater={this.onClickCustomerDisplayClassReconcileLater.bind(this)}
                                                createNoteErrorData={customers.create_note_error_data}
                                                updateNoteErrorData={customers.update_note_error_data}
                                                onSetCameraAppSnap={this.props.setCameraAppSnap}
                                                onClearCameraAppSnap={this.props.clearCameraAppSnap}
                                                onSaveCameraAppSnap={this.props.updateCustomerPicture}
                                                setNotesCheckinCheck={this.props.setNotesCheckinCheck}
                                                clearNotesCheckinCheck={this.props.clearNotesCheckinCheck}
                                                fetchNotes={this.props.fetchNotes}
                                                clearNotes={this.props.clearNotes}
                                                createNote={this.props.createNote}
                                                updateNote={this.props.updateNote}
                                                updateNoteStatus={this.props.updateNoteStatus} />
                                { (customers.create_customer) ?
                                    <CustomerFormCreate inputmask_date={inputmask_date}
                                                        error_data={customers.create_customer_error_data}
                                                        onSubmit={this.onCreateCustomer.bind(this)}
                                                        onCancel={this.onClickAdd.bind(this)} /> : ''
                                }
                                <CustomerFormUpdate display={customers.update_customer}
                                                    inputmask_date={inputmask_date}
                                                    error_data={customers.update_customer_error_data}
                                                    customerID={customers.displayID}
                                                    customers={customers.data}
                                                    onCancel={this.onClickEdit.bind(this)}
                                                    onSubmit={this.onUpdateCustomer.bind(this)} 
                                                    />

                                <CustomersList customers={customers_display}
                                            intl={intl}
                                            onClick={this.onClickCustomersListItem.bind(this)} />
                                {/* <AttendanceList attendance_items={this.props.attendance.data} /> */}
                            </section>
                        </div>
                }
            </PageTemplate>
        )
    }
}

export default Customers
