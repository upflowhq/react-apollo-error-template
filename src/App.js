import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useTimeout } from 'react-use';

const PERSON = gql`
  query person($id: ID!) {
    person(id: $id) {
      id
      name
    }
  }
`;

export default function App() {
  const [show, setShow] = useState(false);

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>When you click on the button, person 1 is needlessly requested again</p>
      <button onClick={() => setShow(true)} disabled={show}>
        Click me
      </button>
      {show && <Person id={2} />}
      <TimeoutPerson id={1} />
    </main>
  );
}

function Person({ id }) {
  const { loading, data } = useQuery(PERSON, { variables: { id }, fetchPolicy: 'network-only' });

  return <p>{loading ? 'Loading...' : data.person.name}</p>;
}

function TimeoutPerson({ id }) {
  const [isTimedOut] = useTimeout(10);
  // The issue occur because the Person component is unmounted before receiving the response
  return !isTimedOut() ? <Person id={id} /> : <></>;
}
