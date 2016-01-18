<?php

namespace App\Services;

use App\Repositories\ClientRepository;
use App\Validators\ClientValidator;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Description of ClientService
 *
 * @author Mario
 */
class ClientService {

    protected $repository;
    protected $validator;

    public function __construct(ClientRepository $repository, ClientValidator $validator) {
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function create(array $data) {
        try {
            $this->validator->with($data)->passesOrFail();
            return $this->repository->create($data);
        } catch (ValidatorException $ex) {
            return [
                'error' => TRUE,
                'message' => $ex->getMessageBag()
            ];
        }
    }

    public function update(array $data, $id) {
        return $this->repository->update($data, $id);
    }

}
