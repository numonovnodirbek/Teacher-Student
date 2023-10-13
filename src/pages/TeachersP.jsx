import { Fragment, useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Table,
  Image,
  Badge,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FormOutlined,
} from "@ant-design/icons";
import { request } from "../server/request";
import { MainContext } from "../contexts/MainContext";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const TeachersP = () => {
  const columns = [
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Image",
      dataIndex: "avatar",
      key: "avatar",

      render: (item) => (
        <Image
          width={50}
          height={50}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          src={item}
          alt={item}
        />
      ),
    },
    {
      title: "Groups",
      dataIndex: "group",
      key: "group",
      render: (group) => (
        <Fragment>
          {Array.isArray(group) && group.length !== 0
            ? group.map((gr) => <Badge count={gr} key={gr} />)
            : "No"}
        </Fragment>
      ),
    },
    {
      title: "IsMarried",
      dataIndex: "isMarried",
      key: "isMarried",
      filters: [
        { text: "Married", value: true },
        { text: "Single", value: false },
      ],
      render: (isMarried) => (
        <Fragment>
          {isMarried ? (
            <p style={{ color: "green", fontWeight: "bold" }}>Married</p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>Single</p>
          )}
        </Fragment>
      ),
      onFilter: (value, record) => record.isMarried === value,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <a href={email}>{email.slice(0, 12)}...</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <Fragment>
          <div className="btn_wrapper">
            <Button
              onClick={() => editTeacher(item.id)}
              type="primary"
              style={{ background: "green", borderColor: "yellow" }}
              icon={<FormOutlined />}
            />
            <Button
              onClick={() => deleteTeacher(item.id)}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
            <Button
              type="primary"
              color="green"
              onClick={() => showTeacherID(item.id)}
            >
              Students
            </Button>
          </div>
        </Fragment>
      ),
    },
  ];

  const context = useContext(MainContext);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [form] = Form.useForm();
  console.log(context.teacherId);
  const getTeachers = async () => {
    setLoading(true);
    try {
      let { data } = await request.get("teacher");

      data = data.map((el) => ({ ...el, key: el.id }));

      setTeachers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  // //IsMarried  filtering
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field === "isMarried") {
      const isMarriedOrder = sorter.order === "descend" ? "desc" : "asc";
      const sortedTeachers = [...teachers].sort((a, b) => {
        if (a.isMarried === b.isMarried) return 0;
        if (a.isMarried && !b.isMarried)
          return isMarriedOrder === "asc" ? -1 : 1;
        return isMarriedOrder === "asc" ? 1 : -1;
      });
      setTeachers(sortedTeachers);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  const submit = async () => {
    try {
      let values = await form.validateFields();
      if (selected) {
        await request.put(`teacher/${selected}`, values);
      } else {
        const updatedValues = {
          ...values,
          group: values.group ? [values.group] : [], // Convert group to an array if not empty
        };
        await request.post("teacher", updatedValues);
      }
      form.resetFields();
      hideModal();
      getTeachers();
    } catch (err) {
      console.log(err);
    }
  };

  const searchTeachers = async () => {
    try {
      setLoading(true);
      let { data } = await request.get("teacher", {
        params: {
          search: searchValue,
        },
      });
      data = data.map((el) => ({ ...el, key: el.id }));
      setTeachers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  async function editTeacher(id) {
    let { data } = await request.get(`teacher/${id}`);
    console.log(data);
    form.setFieldsValue(data);
    setSelected(id);
    showModal();
  }
  async function showTeacherID(id) {
    let { data } = await request.get(`teacher/${id}`);
    context.setTeacherId(data.id);
    navigate("/students");
  }

  const addTeacher = () => {
    showModal();
    setSelected(null);
  };

  function deleteTeacher(id) {
    confirm({
      title: "Do you Want to delete this teacher?",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await request.delete(`teacher/${id}`);
        getTeachers();
      },
    });
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchTeachers();
    }, 500);

    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchValue]);

  return (
    <Fragment>
      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems:"center",
              gap: "20px",
            }}
          >
            <h2 style={{margin:"0", padding:"0"}}>Teachers</h2>
            <Input
              placeholder="Search by name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={searchTeachers}
              style={{ width: "50%", marginRight: 16 }}
            />
            <Button onClick={addTeacher} type="primary">
              Add Teacher
            </Button>
          </div>
        )}
        loading={loading}
        columns={columns}
        dataSource={teachers}
        pagination={{
          position: "bottom",
          pageSize: 10, // Number of items per page
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Adding teacher"
        open={isModalOpen}
        onOk={submit}
        okText={selected ? "Save" : "Add"}
        onCancel={hideModal}
      >
        <Form
          initialValues={{
            isMarried: false,
          }}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="firstName"
            label="First name"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
            name="lastName"
            label="Last name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
              { type: "url", warningOnly: true },
              { type: "string", min: 6 },
            ]}
            name="avatar"
            label="Image"
          >
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone number">
            <Input />
          </Form.Item>
          <Form.Item name="group" label="Group">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Invalid email address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item valuePropName="checked" name="isMarried">
            <Checkbox>Is married ?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersP;
