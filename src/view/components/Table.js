import React from "react";
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip
} from "reactstrap";

const TableComponent = () => {
  return (
    <>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Card tables</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Budget</th>
                    <th scope="col">Status</th>
                    <th scope="col">Users</th>
                    <th scope="col">Completion</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {
                    [1,2,3,4,5].map((items, index) => (
                    <tr>
                        <th scope="row">
                        <Media className="align-items-center">
                            <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                            >
                            <img
                                alt="..."
                                height={"100%"}
                                width={"100%"}
                                src={require("../../assets/img/theme/user.jpg")}
                            />
                            </a>
                            <Media>
                            <span className="mb-0 text-sm">
                                Vue Paper UI Kit PRO
                            </span>
                            </Media>
                        </Media>
                        </th>
                        <td>$2,200 USD</td>
                        <td>
                        <Badge color="" className="badge-dot mr-4">
                            <i className="bg-success" />
                            completed
                        </Badge>
                        </td>
                        <td>
                        <div className="avatar-group">
                            <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip664029969"
                            onClick={(e) => e.preventDefault()}
                            >
                            <img
                                alt="..."
                                height={"100%"}
                                width={"100%"}
                                className="rounded-circle"
                                src={require("../../assets/img/theme/user.jpg")}
                            />
                            </a>
                            <UncontrolledTooltip
                            delay={0}
                            target="tooltip664029969"
                            >
                            Ryan Tompson
                            </UncontrolledTooltip>
                            <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip806693074"
                            onClick={(e) => e.preventDefault()}
                            >
                            {/* <img
                                alt="..."
                                className="rounded-circle"
                                src={require("../../assets/img/theme/team-2-800x800.jpg")}
                            /> */}
                            </a>
                            <UncontrolledTooltip
                            delay={0}
                            target="tooltip806693074"
                            >
                            Romina Hadid
                            </UncontrolledTooltip>
                            <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip844096937"
                            onClick={(e) => e.preventDefault()}
                            >

                            </a>
                            <UncontrolledTooltip
                            delay={0}
                            target="tooltip844096937"
                            >
                            Alexander Smith
                            </UncontrolledTooltip>
                            <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip757459971"
                            onClick={(e) => e.preventDefault()}
                            >
                            </a>
                            <UncontrolledTooltip
                            delay={0}
                            target="tooltip757459971"
                            >
                            Jessica Doe
                            </UncontrolledTooltip>
                        </div>
                        </td>
                        <td>
                        <div className="d-flex align-items-center">
                            <span className="mr-2">100%</span>
                            <div>
                            <Progress
                                max="100"
                                value="100"
                                barClassName="bg-success"
                            />
                            </div>
                        </div>
                        </td>
                        <td className="text-right">
                            <UncontrolledDropdown>
                                <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                                >
                                <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow" right>
                                    <DropdownItem
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Modifier
                                    </DropdownItem>
                                    <DropdownItem
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Supprimer
                                    </DropdownItem>
                                    {/* <DropdownItem
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Voir...
                                    </DropdownItem> */}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </td>
                    </tr>
                    ))
                }
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
    </>
  );
};

export default TableComponent;
