/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Chemist {
  /** @example 1 */
  id?: number;
  /** @example "Начын Сарыглар" */
  full_name?: string;
  /**
   * @format email
   * @example "saryglar@bmstu.ru"
   */
  email?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface LoginResponse {
  /** @example "eyJ0eXAiOiJKV1QiLCJhbGc..." */
  access_token?: string;
  /** @example "bearer" */
  token_type?: string;
}

export interface SynthesisStage {
  /** @example 3 */
  id: number;
  /** @example "Ацетилирование 4-аминофенола" */
  name: string;
  /** @example "Краткое описание реакции" */
  brief_description: string | null;
  /** @example "published" */
  status?: "draft" | "published" | "deleted";
  /** @example "http://localhost:9000/bucket/stages/images/abc.jpg" */
  image_url: string | null;
  /** @example "http://localhost:9000/bucket/stages/videos/abc.mp4" */
  video_url: string | null;
  /**
   * @format float
   * @example 91
   */
  yield_percentage: number | null;
  /** @example 100 */
  temperature_celsius: number | null;
  /** @example 2 */
  likes_count: number;
  /**
   * 1 — этап текущего пользователя
   * @example 0
   */
  is_owner: 0 | 1;
  /**
   * Только в ленте: 1 — текущий химик (из JWT) лайкнул этап, у гостя 0
   * @example 0
   */
  is_liked?: 0 | 1;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string | null;
}

export interface SynthesisStageResponse {
  data: SynthesisStage;
}

export interface SynthesisStageCollectionResponse {
  data: SynthesisStage[];
}

export interface MessageResponse {
  /** @example "Операция выполнена" */
  message?: string;
}

export interface ValidationError {
  /** @example "The given data was invalid." */
  message?: string;
  errors?: Record<string, string[]>;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API Этапов синтеза
 * @version 1.0.0
 * @baseUrl /api
 *
 * REST API учёта этапов химического синтеза. Публичное чтение без токена; создание и изменение — JWT Bearer.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  chemists = {
    /**
     * @description Создание учётной записи. Авторизация не требуется.
     *
     * @tags Chemists
     * @name RegisterChemist
     * @summary Регистрация химика
     * @request POST:/chemists/register
     */
    registerChemist: (
      data: {
        /**
         * @maxLength 255
         * @example "Начын Сарыглар"
         */
        full_name: string;
        /**
         * @format email
         * @maxLength 255
         * @example "saryglar@bmstu.ru"
         */
        email: string;
        /**
         * @format password
         * @minLength 6
         * @example "secret123"
         */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: Chemist;
        },
        ValidationError
      >({
        path: `/chemists/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выдаёт access_token для заголовка Authorization. Авторизация не требуется.
     *
     * @tags Chemists
     * @name LoginChemist
     * @summary Вход (JWT)
     * @request POST:/chemists/login
     */
    loginChemist: (
      data: {
        /**
         * @format email
         * @example "saryglar@bmstu.ru"
         */
        email: string;
        /**
         * @format password
         * @example "secret123"
         */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        LoginResponse,
        | {
            /** @example "Неверный email или пароль" */
            message?: string;
          }
        | ValidationError
      >({
        path: `/chemists/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Инвалидирует текущий токен (blacklist).
     *
     * @tags Chemists
     * @name LogoutChemist
     * @summary Выход (blacklist JWT)
     * @request POST:/chemists/logout
     * @secure
     */
    logoutChemist: (params: RequestParams = {}) =>
      this.request<object, MessageResponse>({
        path: `/chemists/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  synthesisStages = {
    /**
     * @description Только lifecycle_status=published. Фильтр по минимальной температуре.
     *
     * @tags Synthesis Stages
     * @name ListSynthesisStages
     * @summary Список опубликованных этапов
     * @request GET:/synthesis-stages
     */
    listSynthesisStages: (
      query?: {
        /**
         * Минимальная температура реакции, °C (reaction_temperature_celsius >= значение)
         * @example 80
         */
        filter_temperature?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SynthesisStageCollectionResponse, any>({
        path: `/synthesis-stages`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Загрузка медиа в S3/MinIO. Повторный черновик — 400.
     *
     * @tags Synthesis Stages
     * @name CreateSynthesisDraft
     * @summary Создание черновика (multipart, MinIO)
     * @request POST:/synthesis-stages
     * @secure
     */
    createSynthesisDraft: (
      data: {
        /**
         * @maxLength 150
         * @example "Перекристаллизация парацетамола"
         */
        name: string;
        /**
         * Изображение этапа (image/*, max 10 MB)
         * @format binary
         */
        media_image?: File;
        /**
         * Короткое видео (mp4/webm/quicktime, max 50 MB)
         * @format binary
         */
        media_video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SynthesisStageResponse,
        | {
            /** @example "Черновик уже существует" */
            message?: string;
          }
        | void
        | ValidationError
      >({
        path: `/synthesis-stages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id — первый этап. С id — этот этап. С next=true — следующий после id (циклически). JWT необязателен: с ним is_liked показывает лайк текущего химика.
     *
     * @tags Synthesis Stages
     * @name GetSynthesisFeed
     * @summary Лента: один опубликованный этап
     * @request GET:/synthesis-stages/feed/{id}
     * @secure
     */
    getSynthesisFeed: (
      id?: number,
      query?: {
        /**
         * Перейти к следующему этапу после id
         * @example true
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SynthesisStageResponse,
        {
          /** @example "Нет опубликованных этапов" */
          message?: string;
        }
      >({
        path: `/synthesis-stages/feed/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Один черновик на химика (последний по id).
     *
     * @tags Synthesis Stages
     * @name GetSynthesisDraft
     * @summary Черновик текущего пользователя
     * @request GET:/synthesis-stages/draft
     * @secure
     */
    getSynthesisDraft: (params: RequestParams = {}) =>
      this.request<
        SynthesisStageResponse,
        void | {
          /** @example "Черновик не найден" */
          message?: string;
        }
      >({
        path: `/synthesis-stages/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Меняет status на published. Только свой черновик.
     *
     * @tags Synthesis Stages
     * @name PublishSynthesisStage
     * @summary Публикация черновика
     * @request PUT:/synthesis-stages/{id}/publish
     * @secure
     */
    publishSynthesisStage: (
      id: number,
      data: {
        /**
         * @maxLength 1000
         * @example "Очистка сырца из водного раствора."
         */
        brief_description: string;
        /**
         * @format float
         * @min 0
         * @max 100
         * @example 76.4
         */
        yield_percentage: number;
        /**
         * @min -273
         * @max 2000
         * @example 25
         */
        reaction_temperature_celsius: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SynthesisStageResponse, void | ValidationError>({
        path: `/synthesis-stages/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description lifecycle_status → deleted. Только свои этапы.
     *
     * @tags Synthesis Stages
     * @name DeleteSynthesisStage
     * @summary Логическое удаление этапа
     * @request DELETE:/synthesis-stages/{id}
     * @secure
     */
    deleteSynthesisStage: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "Этап логически удалён" */
          message?: string;
        },
        void | {
          /** @example "Невозможно удалить этот этап (не найден или нет прав)" */
          message?: string;
        }
      >({
        path: `/synthesis-stages/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description action=1 — лайк, action=0 — отмена.
     *
     * @tags Synthesis Stages
     * @name SetSynthesisLike
     * @summary Поставить или снять лайк
     * @request POST:/synthesis-stages/{id}/like
     * @secure
     */
    setSynthesisLike: (
      id: number,
      data: {
        /**
         * 1 — лайк, 0 — снять лайк
         * @example 1
         */
        action: 0 | 1;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Статус лайка обновлен" */
          message?: string;
        },
        void | ValidationError
      >({
        path: `/synthesis-stages/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id — первый этап. С id — этот этап. С next=true — следующий после id (циклически). JWT необязателен: с ним is_liked показывает лайк текущего химика.
     *
     * @tags Synthesis Stages
     * @name FirstSynthesisStage
     * @summary Лента: один опубликованный этап
     * @request GET:/synthesis-stages/feed
     * @secure
     */
    firstSynthesisStage: (params: RequestParams = {}) =>
      this.request<
        SynthesisStageResponse,
        {
          /** @example "Нет опубликованных этапов" */
          message?: string;
        }
      >({
        path: `/synthesis-stages/feed`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
