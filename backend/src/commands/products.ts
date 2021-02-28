import { client } from './utils/apollo_client'
import { login } from './utils/login'
import { CREATE_PRODUCT } from '../common/grapql_schemas/products'

const createProduct = async (status, price) => {
  return client.mutate({
    mutation: CREATE_PRODUCT,
    variables: {
      price,
      status,
    },
  })
}

const main = async () => {
  try {
    await login()
    await createProduct('CLEANING', 100)
    await createProduct('SECURITY_DEPOSIT', 500)
  } catch (e) {
    console.error(e)
  }
}

main()
  .then((result) => {
    console.log(result)
  })
  .catch((e) => {
    console.error(e)
  })
