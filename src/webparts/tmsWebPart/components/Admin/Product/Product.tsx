/**
 * React Package Import
 */
import * as React from "react"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IProductProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Table, Row, Col, Input, Button, Space, Spin, Layout } from "antd"

/**
 * Ant Design Icons Import
 */
import { EditOutlined } from "@ant-design/icons"

/**
 * Helper Section's Methods Import.
 * @param rightsToBoolean Convert Multiple Boolean Values Into Single String. (This is Used For User Rights)
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemsParams, listTitles } from "../../../helper"

/**
 * This Code Block Is Type Declaration Of DataTable
 */
type ProductCols = {
    sr?: Number
    productName?: String
    isActive?: String
    actions?: any
}

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type IProductState = {
    rowData: Array<ProductCols>
    columns: Array<any>
    productSearch: string
}

/**
 * Main Class Of Component.
 */
class Product extends React.Component<IProductProp, IProductState> {
    /**
     * State Initialization.
     */
    public state: IProductState = {
        columns: [
            { title: "Sr#", dataIndex: "sr", key: "sr" },
            {
                title: "Product Name",
                dataIndex: "productName",
                key: "productName",
            },
            {
                title: "isActive",
                dataIndex: "isActive",
                key: "isActive",
            },
            {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text, record) => (
                    <Space size="middle">
                        <Button
                            shape="circle"
                            type="link"
                            /*@ts-ignore*/
                            icon={<EditOutlined />}
                            onClick={() => console.log(record)}
                        />
                    </Space>
                ),
            } as any,
        ],
        rowData: [],
        productSearch: "",
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch All Products Details.
     */
    public componentDidMount() {
        this.fetchProducts()
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        const { columns, rowData, productSearch } = this.state
        return (
            <>
                <Spin>
                    <Layout
                        style={{
                            backgroundColor: "white",
                        }}
                    >
                        <Layout.Content style={{ marginTop: "3em" }}>
                            <Row>
                                {/* Add Product Button Section Start */}
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        /*@ts-ignore*/
                                        size="middle"
                                    >
                                        Add Product
                                    </Button>
                                </Col>
                                {/* Add Product Button Section Start */}

                                {/* Search Product  Section Start */}
                                <Col span={12}>
                                    <Space>
                                        <Input
                                            placeholder="Search Product"
                                            value={productSearch}
                                            onChange={(e) => {
                                                this.setState({
                                                    productSearch:
                                                        e.target.value,
                                                })
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            /*@ts-ignore*/
                                            icon={<EditOutlined />}
                                            size="middle"
                                            onClick={this.fetchProducts}
                                        >
                                            Search
                                        </Button>
                                    </Space>
                                </Col>
                                {/* Search Product  Section Start */}
                            </Row>

                            {/* Product Data Display  Section Start */}
                            <Row>
                                <Col span={24}>
                                    <Table
                                        columns={columns}
                                        dataSource={rowData}
                                        scroll={{ y: 550 }}
                                        size="small"
                                    ></Table>
                                </Col>
                            </Row>
                            {/* Product Data Display  Section Start */}
                        </Layout.Content>
                    </Layout>
                </Spin>
            </>
        )
    }

    /**
     * This Method Fetch All The Data Of Products For DataTable
     */
    private fetchProducts = async () => {
        try {
            const { absUrl, httpClient } = this.props
            let customfilter = this.customSearch()
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.PRODUCT_INFORMATION,
                filters: `${customfilter}`,
            })
            const response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            const result = await response.json()
            const _data: Array<ProductCols> = result.value.length
                ? result.value.map(
                      (x: any, ind: number) =>
                          ({
                              sr: ind + 1,
                              productName: x.ProductName,
                              isActive: x.IsActive ? "Yes" : "No",
                              actions: x.Id,
                          } as ProductCols)
                  )
                : []
            this.setState({ rowData: _data })
        } catch (error) {
            console.error("Error while Fetch All Proudcts", error)
        }
    }

    /**
     * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
     */
    private customSearch = () => {
        try {
            let { productSearch } = this.state

            let filterVariable: string = ""

            if (productSearch) {
                filterVariable = "$filter=ProductName eq" + productSearch
            } else {
                filterVariable = ""
            }
            return filterVariable
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Re-Direct Admin to Edit Product Page With ID
     * @param value This Is Id Of Product's Which Data Admin Wants To Edit
     */
    private goToEditProduct = (value) => {
        this.props.history.push({
            pathname: `/edit-product/${value}`,
            state: {
                productId: value,
            },
        })
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
export default connect(mapStateToProps)(Product)
