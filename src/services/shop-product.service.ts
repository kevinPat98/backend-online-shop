import { randomItems } from './../lib/db-operations';
import { ACTIVE_VALUES_FILTER, COLLECTIONS } from './../config/constants';
import ResolversOperationsService from './resolvers-operations.service';

class ShopProductsService extends ResolversOperationsService {
  collection = COLLECTIONS.SHOP_PRODUCT;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }
  async items(
    active: string = ACTIVE_VALUES_FILTER.ACTIVE,
    platform: string = '',
    random: boolean = false,
    otherfilters: object = {}
  ) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: false };
    }
    if (platform !== '' && platform !== undefined){
      filter = {...filter, ...{platform_id: platform}};
    }
    if (otherfilters !== {} && otherfilters !== undefined){
      filter = {...filter, ...otherfilters};
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    if(!random){
      const result = await this.list(
        this.collection,
        'Productos de la tienda',
        page,
        itemsPage,
        filter
      );
      return {
        info: result.info,
        status: result.status,
        message: result.message,
        shopProducts: result.items,
      };
    }
    const result: Array<object> = await randomItems(
      this.getDb(),
      this.collection,
      filter,
      itemsPage
    );
    if (result.length === 0 || result.length !== itemsPage){
      return {
        info: {page: 1, pages: 1, itemsPage, total: 0},
        status: false,
        message: 'La información solicitada no se ha obtenido correctamente',
        shopProducts: [],
      };
    }
    return {
      info: {page: 1, pages: 1, itemsPage, total: itemsPage},
      status: true,
      message: 'La información solicitada se ha obtenido correctamente',
      shopProducts: result,
    };
  }
}
export default ShopProductsService;
