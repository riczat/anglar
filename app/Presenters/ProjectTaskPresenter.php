<?php

namespace App\Presenters;

use App\Transformers\ProjectTaskTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProjectMemberPresenter
 *
 * @package namespace App\Presenters;
 */
class ProjectTaskPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProjectTaskTransformer();
    }
}
