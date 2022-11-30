import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { Accordion, Badge, Center, Code, Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import {
  createHashRouter,
  RouterProvider,
  useNavigate,
  useParams,
} from "react-router-dom";
import data from "./generated/data.json";
import Root from "./routes/Root";

const MyCode = ({
  className,
  children,
}: {
  className: string;
  children: string;
}) => {
  const language = className.replace("lang-", "");
  // @ts-ignore
  return <Prism language={language}>{children}</Prism>;
};

interface OrderdKeys {
  keys: string[];
  children?: {
    [key: string]: OrderdKeys;
  };
}

const orderd_keys: OrderdKeys = {
  keys: ["group1", "group2"],
  children: {
    group1: { keys: ["a", "b"] },
    group2: { keys: ["a", "b"] },
  },
};

interface AccordianTitleProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
}

interface AccordianItemProps {
  heading: AccordianTitleProps;
  id: string;
  text: string;
}

function AccordianTitle({ title, subtitle, tags, date }: AccordianTitleProps) {
  return (
    <>
      <Group>
        <Text fw={600} fz="lg">
          # {title}
        </Text>
        <Group grow={false} spacing={5} noWrap>
          {tags?.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </Group>
      </Group>
      <Group position="apart">
        {subtitle && <Code>{subtitle}</Code>}
        {date && (
          <Text c="dimmed" fs="italic">
            {date}
          </Text>
        )}
      </Group>
    </>
  );
}

function AccordianItem({ id, heading, text }: AccordianItemProps) {
  return (
    <Accordion.Item value={id}>
      <Accordion.Control>
        <AccordianTitle {...heading} />
      </Accordion.Control>
      <Accordion.Panel>
        <Markdown
          options={{
            overrides: {
              code: {
                component: MyCode,
              },
            },
          }}
        >
          {text}
        </Markdown>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/:group",
        element: <GroupItems />,
        errorElement: <Center>Not Found</Center>,
      },
      {
        path: "/:group/:item",
        element: <GroupItems />,
        errorElement: <Center>Not Found</Center>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function GroupItems() {
  const params = useParams();
  const [activeElement, setActiveElement] = useState<string | null>();
  const [groupItems, setGroupItems] = useState<typeof data.nginx>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load groups
    if (params.group) {
      let key = params.group as keyof typeof data;
      setGroupItems(data[key]);
    }
    console.log(params);
    if (params.item) {
      // TODO: move logic to router
      // Throw error if item not found!
      setActiveElement(params.item);
    } else {
      setActiveElement(null);
    }
  }, [params.item, params.group]);

  return (
    <Accordion
      onChange={(value) => {
        setActiveElement(value);
        if (value) {
          navigate(`/${params.group}/${value}`);
        } else {
          navigate(`/${params.group}`);
        }
      }}
      value={activeElement}
      variant="separated"
    >
      {groupItems.map((item, i) => (
        <AccordianItem
          key={item.id}
          id={item.id}
          heading={item.heading}
          text={item.text}
        />
      ))}
    </Accordion>
  );
}

export default App;
