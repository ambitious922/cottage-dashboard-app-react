export const createProducerMutationGql = `mutation createProducer ($input: CreateProducerInput!) {
  createProducer(input: $input) {
    producer {
      id
      roles
      firstName
      lastName
      email
      phoneNumber
    }
  }
}`;

export const getProducerBusinessQueryGql = `query getProducerAndBusiness ($input: NullableByIdInput!) {
  producer(input: $input) {
    id
    acceptedTermsAt
    email
    phoneNumber
    firstName
    lastName
    roles
    avatar
    business {
      id
      status
      level
      title
      subdomain
    }
  }
}`;

export const getProducerQueryGql = `query getProducer ($input: NullableByIdInput!) {
  producer(input: $input) {
    id
    acceptedTermsAt
    email
    phoneNumber
    firstName
    lastName
    roles
    avatar
  }
}`;

export const updateProducerMutationGql = `mutation updateProducer ($input: UpdateProducerInput!) {
  updateProducer(input: $input) {
    producer {
      id
      firstName
      lastName
      email
      phoneNumber
      avatar
    }
  }
}`;
