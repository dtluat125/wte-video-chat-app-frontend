import { trimData } from "../../common/helpers";

export class ApiService {
  client;
  baseUrl;

  constructor(params, axios) {
    this.client = axios;
    this.baseUrl = params.baseUrl;
  }

  get detailUrl() {
    return this.baseUrl;
  }

  get createUrl() {
    return this.baseUrl;
  }

  get updateUrl() {
    return this.baseUrl;
  }

  get deleteUrl() {
    return this.baseUrl;
  }

  useClient(axios) {
    this.client = axios;
  }

  beforeCreate(params) {
    trimData(params);
    return params;
  }

  beforeUpdate(params) {
    trimData(params);
    return params;
  }

  _getList(queryString) {
    return this.client.get(`${this.baseUrl}`, {
      params: queryString,
    });
  }

  _getDetail(id) {
    return this.client.get(this.detailUrl + "/" + id);
  }

  _create(params) {
    params = this.beforeCreate(params);
    return this.client.post(this.createUrl, params);
  }

  _update(id, params) {
    params = this.beforeUpdate(params);
    return this.client.patch(this.updateUrl + "/" + id, params);
  }

  _delet(id) {
    return this.client.delete(this.deleteUrl + "/" + id);
  }
}
