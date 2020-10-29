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

import { readItemParams, listTitles, updateItemParams } from "../../../helper"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IEditProductProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Row, Col, Input, Button, message, Spin, Form, Radio , PageHeader } from "antd"

/**
 * Ant Design Icons Import
 */
import { LoadingOutlined } from "@ant-design/icons"

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
type IProductStates = {
    isActive: boolean
    productName: string
    validated: boolean
    invalidItems: Array<string>
    showConfirmation: boolean
    saveConfirm: boolean
    etag: any
    isLoading: boolean
    isButtonLoading: boolean
    formTitle: string
    formDescription: string
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class IEditProduct extends React.Component<IEditProductProp, IProductStates> {
    /**
     * State Initialization.
     */
    public state: IProductStates = {
        isActive: true,
        productName: "",
        validated: true,
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        etag: null,
        isButtonLoading: false,
        isLoading: false,
        formTitle: "",
        formDescription: "",
    }

    /**
     * React Life Cycle Method.
     * This Method Call Method Which Fetch Specific Product Data.
     */
    public componentDidMount() {
        try {
            if (this.props.match.params.id) {
                const _id = parseInt(this.props.match.params.id)
                this.fetchProductDetails(_id)
            }
        } catch (error) {
            console.error("Error while Edit Product componentDidMount")
        }
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        const {
            isActive,
            validated,
            invalidItems,
            showConfirmation,
            saveConfirm,
            productName,
            isButtonLoading,
            isLoading,
        } = this.state

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
                <Row>
                        <Col span={24}>
                            <div
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    padding: "2%",
                                }}
                            >
                                <PageHeader
                                    className="site-page-header"
                                    title="Edit Product Details"
                                    subTitle="Please provide all details to update Product Details"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Form {...layout} labelAlign="left"  style={{
                            margin: "1%",
                        }}>
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
                                <Radio value={true}>YES</Radio>
                                <Radio value={false}>No</Radio>
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
                                        Update
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
     * This Method Specific Data Based On Given It
     */
    private fetchProductDetails = async (itemId) => {
        try {
            const { httpClient, absUrl } = this.props
            const param = readItemParams({
                absoluteUrl: absUrl,
                itemId: itemId,
                listTitle: listTitles.PRODUCT_INFORMATION,
                filters: "",
            })
            const response = await httpClient.get(
                param.url,
                param.config,
                param.options
            )
            const result = await response.json()
            this.setState({
                etag: response.headers.get("ETag"),
            })
            const _item = result
            this.setState({
                productName: _item.ProductName,
                isActive: _item.isActive,
            })
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Perform Validation Checks
     */
    private handleSubmit = async () => {
        try {
            if (this.state.productName === "") {
                message.info(
                    "Invalid Entries. Please Enter the Required the fields"
                )
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.updateProduct()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Redirect Users To Customer Tab
     */
    private onCancelClick = () => {
        this.props.history.push("/admin/product-information")
    }

    /**
     * This Method Update Data Of Custom List.
     */
    private updateProduct = async () => {
        try {
            const { isActive, productName, etag } = this.state
            const { absUrl, match, httpClient } = this.props
            const { url, config, options } = updateItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.PRODUCT_INFORMATION,
                body: {
                    __metadata: { type: "SP.Data.ProductInformationListItem" },
                    ProductName: productName,
                    isActive: isActive,
                },
                etag: etag,
                itemId: parseInt(match.params.id),
            })
            const response = await httpClient.post(url, config, options)
            let result = response
            if (result.status == 204) {
                this.setState({ isButtonLoading: false }, () => {
                    message.success("Data Update Successfully")
                })
            } else {
                this.setState({ isButtonLoading: false }, () => {
                    message.error("Something Is Wrong!!! Try Again Latter")
                })
            }
        } catch (error) {
            console.error("Error while update  Product Details" + error)
        }
    }

    /**
     * This Method Close Confirmation Dialog Box
     * ! I Need To Delete This Code
     */
    // closeConfirmationDialog = () => {
    //   this.setState({ showConfirmation: false });
    // };

    /**
     * This Method Close Save Confirmation Dialog Box
     * Redirect The User To Product Tab
     *  ! I Need To Delete This Code
     */
    // closeSaveConfirmDialog = () => {
    //   this.setState({ saveConfirm: false });
    //   this.props.history.push("/admin/product-information");
    // };

    /**
     * This Method Take Final Confirmation From User And Call Update Product Method
     *  ! I Need To Delete This Code
     */
    // onUpdateConfirm = () => {
    //   this.updateProduct().then(() => {
    //     this.closeConfirmationDialog();
    //     this.setState({ saveConfirm: true });
    //   });
    // };
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
export default connect(mapStateToProps)(IEditProduct)
