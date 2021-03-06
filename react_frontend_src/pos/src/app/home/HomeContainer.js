import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';

import HomeComponent from "./HomeComponent"
import { appOperations } from '../duck'


const mapStateToProps = state => 
    ({
        app: state.app
    })

const mapDispatchToProps = dispatch =>
    ({
        setLoadingMessage(message) {
            dispatch(appOperations.setLoadingMessage(message))
        },
        setPageTitle(title) {
            dispatch(appOperations.setPageTitle(title))
        }
    })


const HomeContainer = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeComponent))

export default HomeContainer