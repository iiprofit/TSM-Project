/**
 * React Package Import
 */
import * as React from "react"

/**
 * Component Specific CSS Import
 */
import "./Product.scss"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 *
 */
import { SPHttpClientResponse } from "@microsoft/sp-http"

/**
 * This Package Is Used To Generate Unique ID's.
 */
import * as uuid from "uuid"

/**
 * Helper Section's Methods Import.
 * @param createItemParams Insert Data Into Any Custom List Of SharePoint.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { createItemParams, listTitles } from "../../../helper"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IAddProductProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import {
    Row,
    Col,
    Input,
    Button,
    message,
    Select,
    Spin,
    Form,
    Radio,
} from "antd"

/**
 * Ant Design Icons Import
 */
import { LoadingOutlined } from "@ant-design/icons"

// This Options Component Is Used With Select Component.
const { Option } = Select

/**
 * Custom Component Import.
 * This Component Take Final Confirmaiton Of User.
 */
import ConfirmationDialog from "../../Dialogs/ConfirmationDialog"

/**
 * Custom Component Import.
 * This Component Show Success Message Of Any Operation Performed By User.
 */
import SuccessDialog from "../../Dialogs/SuccessDialog"

/**
 * Types Declaration Of Current Component States
 */
type IAddProductStates = {
    isActive: boolean
    productName: string
    validated: boolean
    invalidItems: Array<string>
    showConfirmation: boolean
    saveConfirm: boolean
    isLoading: boolean
    isButtonLoading: boolean
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class AddProduct extends React.Component<IAddProductProp, IAddProductStates> {
    /**
     * State Initialization.
     */
    public state: IAddProductStates = {
        isActive: true,
        validated: true,
        productName: "",
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        isLoading: false,
        isButtonLoading: false,
    }

    /**
     * React Life Cycle Method
     */
    public componentDidMount() {}

    /**
     * Render() Method
     */
    render(): React.ReactElement {
        // Destructuring Of States
        const { isActive, productName, isButtonLoading, isLoading } = this.state

        /**
         *  Form Layout Attributes.
         *  Form Design Based On Below Mentioned Attributes.
         */
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        }

        return (
            <>
                {/* Spin Component Is Used For Loading Process */}
                {/* We Need To impliment Is loading In Spin */}
                <Spin spinning={isLoading} indicator={loadingIcon}>
                    <Form {...layout} labelAlign="left">
                        {/* Product Section Start */}
                        <Form.Item label="Product Name">
                            <Input
                                defaultValue={productName}
                                value={productName}
                                onChange={(e) =>
                                    this.setState({
                                        productName: e.target.value,
                                    })
                                }
                                placeholder="Enter product name"
                            />
                        </Form.Item>
                        {/* Product Section End */}

                        {/* Product Status Section Start */}
                        <Form.Item label="Is Active">
                            <Radio.Group
                                onChange={(e) =>
                                    this.setState({ isActive: e.target.value })
                                }
                                value={isActive}
                            >
                                <Radio value={true}>True</Radio>
                                <Radio value={false}>False</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* Product Status Section End */}

                        {/* Action Button Section Start */}
                        <Form.Item>
                            <Row align="middle">
                                <Col span={3} offset={4}>
                                    <Button
                                        type="primary"
                                        loading={isButtonLoading}
                                        onClick={this.handleSubmit}
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col span={3} offset={10}>
                                    <Button
                                        type="primary"
                                        onClick={this.onCancelClick}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                        {/* Action Button Section End */}
                    </Form>
                </Spin>
            </>
        )
    }

    /**
     * This Method Perform Validation Checks
     */
    handleSubmit = async () => {
        try {
            if (this.state.productName === "") {
                message.info(
                    "Invalid Entries. Please Enter the Required the fields"
                )
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.saveProduct()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Redirect Users To Product Tab
     */
    onCancelClick = () => {
        this.props.history.push("/admin/product-information")
    }

    /**
     * This Method Save Data Into Custom List
     */
    saveProduct = async () => {
        const { isActive, productName } = this.state
        const { absUrl } = this.props
        const { url, config, options } = createItemParams({
            absoluteUrl: absUrl,
            listTitle: listTitles.PRODUCT_INFORMATION,
            body: {
                __metadata: { type: "SP.Data.ProductInformationListItem" },
                ProductName: productName,
                isActive: isActive,
                uuid: uuid.v4(),
            },
        })

        try {
            const response: SPHttpClientResponse = await this.props.httpClient.post(
                url,
                config,
                options
            )
            const result = await response.json()

            result.Id
                ? this.setState(
                      {
                          isButtonLoading: false,
                          productName: null,
                      },
                      () => {
                          message.success("Data Inserted Successfully")
                      }
                  )
                : this.setState({ isButtonLoading: false }, () => {
                      message.error("Something Is Wrong!!! Try Again Latter")
                  })
            return true
        } catch (error) {
            console.error(error)
        }
    }
}

/**
 * Redux Map Funtion Which Map Global Store's State To Props Of Current Component.
 */
const mapStateToProps = (state) => ({
    absUrl: state.dashboard.absoluteUrl,
    httpClient: state.dashboard.httpClient,
})

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(AddProduct)
