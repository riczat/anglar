<?php

namespace App\Presenters;

use App\Transformers\ProjectMemberTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProjectMemberPresenter
 *
 * @package namespace App\Presenters;
 */
class ProjectMemberPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProjectMemberTransformer();
    }
}
